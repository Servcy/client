import { Fragment, ReactNode, useEffect, useRef, useState } from "react"

import { Combobox } from "@headlessui/react"
import { Check, ChevronDown, Search } from "lucide-react"
import { observer } from "mobx-react-lite"
import { usePopper } from "react-popper"

import { useWorkspace } from "@hooks/store"
import { useDropdownKeyDown } from "@hooks/use-dropdown-key-down"
import useOutsideClickDetector from "@hooks/use-outside-click-detector"

import { cn } from "@helpers/common.helper"

import { DropdownButton } from "./buttons"
import { BUTTON_VARIANTS_WITH_TEXT } from "./constants"
import { TDropdownProps } from "./types"

type Props = TDropdownProps & {
    button?: ReactNode
    dropdownArrow?: boolean
    dropdownArrowClassName?: string
    onChange: (val: string) => void
    onClose?: () => void
    value: string | null
}

export const WorkspaceDropdown: React.FC<Props> = observer((props) => {
    const {
        button,
        buttonClassName,
        buttonContainerClassName,
        buttonVariant,
        className = "",
        disabled = false,
        dropdownArrow = false,
        dropdownArrowClassName = "",
        onChange,
        onClose,
        placeholder = "Workspace",
        placement,
        showTooltip = false,
        tabIndex,
        value,
    } = props
    // states
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    // refs
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    // popper-js refs
    const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    // popper-js init
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: placement ?? "bottom-start",
        modifiers: [
            {
                name: "preventOverflow",
                options: {
                    padding: 12,
                },
            },
        ],
    })
    // store hooks
    const { workspaces } = useWorkspace()
    const workspacesList = Object.values(workspaces ?? {})
    const options = workspacesList?.map((workspace) => ({
        value: workspace.id,
        query: `${workspace?.name}`,
        content: (
            <div className="flex items-center gap-2">
                <span
                    className={`relative flex h-6 w-6 flex-shrink-0 items-center  justify-center p-2 text-xs uppercase ${
                        !workspace?.logo && "rounded bg-custom-primary-500 text-white"
                    }`}
                >
                    {workspace?.logo && workspace.logo !== "" ? (
                        <img
                            src={workspace.logo}
                            className="absolute left-0 top-0 h-full w-full rounded object-cover"
                            alt="Workspace Logo"
                        />
                    ) : (
                        workspace?.name?.charAt(0) ?? "..."
                    )}
                </span>
                <span className="flex-grow truncate">{workspace?.name}</span>
            </div>
        ),
    }))

    const filteredOptions =
        query === "" ? options : options?.filter((o) => o.query.toLowerCase().includes(query.toLowerCase()))

    const selectedWorkspace = workspacesList.find((workspace) => workspace.id === value)

    const handleClose = () => {
        if (!isOpen) return
        setIsOpen(false)
        onClose && onClose()
    }

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen)
    }

    const dropdownOnChange = (val: string) => {
        console.log(val, "megham-22")
        onChange(val)
        handleClose()
    }

    const handleKeyDown = useDropdownKeyDown(toggleDropdown, handleClose)

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        toggleDropdown()
    }

    useOutsideClickDetector(dropdownRef, handleClose)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    return (
        <Combobox
            as="div"
            ref={dropdownRef}
            tabIndex={tabIndex}
            className={cn("h-full", className)}
            value={value}
            onChange={dropdownOnChange}
            disabled={disabled}
            onKeyDown={handleKeyDown}
        >
            <Combobox.Button as={Fragment}>
                {button ? (
                    <button
                        ref={setReferenceElement}
                        type="button"
                        className={cn("clickable block h-full w-full outline-none", buttonContainerClassName)}
                        onClick={handleOnClick}
                    >
                        {button}
                    </button>
                ) : (
                    <button
                        ref={setReferenceElement}
                        type="button"
                        className={cn(
                            "clickable block h-full max-w-full outline-none",
                            {
                                "cursor-not-allowed text-custom-text-200": disabled,
                                "cursor-pointer": !disabled,
                            },
                            buttonContainerClassName
                        )}
                        onClick={handleOnClick}
                    >
                        <DropdownButton
                            className={buttonClassName}
                            isActive={isOpen}
                            tooltipHeading="Select a workspace"
                            tooltipContent={selectedWorkspace?.name ?? placeholder}
                            showTooltip={showTooltip}
                            variant={buttonVariant}
                        >
                            {selectedWorkspace?.logo && selectedWorkspace.logo !== "" ? (
                                <span className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center p-2 text-xs uppercase">
                                    <img
                                        src={selectedWorkspace.logo}
                                        className="absolute left-0 top-0 h-full w-full rounded object-cover"
                                        alt="Workspace Logo"
                                    />
                                </span>
                            ) : (
                                (
                                    <span className="relative flex h-6 w-6 flex-shrink-0 items-center  justify-center p-2 text-xs uppercase rounded bg-custom-primary-500 text-white">
                                        {selectedWorkspace?.name?.charAt(0)}
                                    </span>
                                ) ?? null
                            )}
                            {BUTTON_VARIANTS_WITH_TEXT.includes(buttonVariant) && (
                                <span className="flex-grow truncate">{selectedWorkspace?.name ?? placeholder}</span>
                            )}
                            {dropdownArrow && (
                                <ChevronDown
                                    className={cn("h-2.5 w-2.5 flex-shrink-0", dropdownArrowClassName)}
                                    aria-hidden="true"
                                />
                            )}
                        </DropdownButton>
                    </button>
                )}
            </Combobox.Button>
            {isOpen && (
                <Combobox.Options className="fixed z-10" static>
                    <div
                        className="my-1 w-48 rounded border-[0.5px] border-custom-border-300 bg-custom-background-100 px-2 py-2.5 text-xs shadow-custom-shadow-rg focus:outline-none"
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <div className="flex items-center gap-1.5 rounded border border-custom-border-100 bg-custom-background-90 px-2">
                            <Search className="h-3.5 w-3.5 text-custom-text-400" strokeWidth={1.5} />
                            <Combobox.Input
                                as="input"
                                ref={inputRef}
                                className="w-full bg-transparent py-1 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search"
                                displayValue={(assigned: any) => assigned?.name}
                            />
                        </div>
                        <div className="mt-2 max-h-48 space-y-1 overflow-y-scroll">
                            {filteredOptions ? (
                                filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => (
                                        <Combobox.Option
                                            key={option.value}
                                            value={option.value}
                                            className={({ active, selected }) =>
                                                `w-full truncate flex items-center justify-between gap-2 rounded px-1 py-1.5 cursor-pointer select-none ${
                                                    active ? "bg-custom-background-80" : ""
                                                } ${selected ? "text-custom-text-100" : "text-custom-text-200"}`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className="flex-grow truncate">{option.content}</span>
                                                    {selected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                ) : (
                                    <p className="text-custom-text-400 italic py-1 px-1.5">No matching results</p>
                                )
                            ) : (
                                <p className="text-custom-text-400 italic py-1 px-1.5">Loading...</p>
                            )}
                        </div>
                    </div>
                </Combobox.Options>
            )}
        </Combobox>
    )
})
