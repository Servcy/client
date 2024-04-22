import { FC, Fragment, useEffect, useRef, useState } from "react"

import { Combobox } from "@headlessui/react"
import { Check, Search } from "lucide-react"
import { observer } from "mobx-react-lite"
import { usePopper } from "react-popper"

import { useIssues } from "@hooks/store"
import { useDropdownKeyDown } from "@hooks/use-dropdown-key-down"
import useOutsideClickDetector from "@hooks/use-outside-click-detector"

import { EIssuesStoreType } from "@constants/issue"

import { cn } from "@helpers/common.helper"

import { IProject, TIssue } from "@servcy/types"

import { DropdownButton } from "./buttons"
import { BUTTON_VARIANTS_WITH_TEXT } from "./constants"
import { TDropdownProps } from "./types"

type TIssueDropdown = TDropdownProps & {
    workspaceSlug: string
    onChange: (val: string) => void
    hasError: boolean
    value: string | null
    project: IProject
}

export const IssueDropdown: FC<TIssueDropdown> = observer((props) => {
    const {
        buttonClassName,
        buttonContainerClassName,
        buttonVariant,
        className,
        disabled = false,
        project,
        onChange,
        placement,
        showTooltip = false,
        tabIndex,
        value,
    } = props
    // states
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    // const [issues, setIssues] = useState<TIssue[]>([] as TIssue)
    const { issues: projectIssues, issueMap } = useIssues(EIssuesStoreType.PROJECT)
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
    const options = projectIssues?.issues[project?.id.toString()]
        ?.map((id) => issueMap[id])
        ?.map((issue: TIssue) => ({
            value: issue.id.toString(),
            query: issue?.name,
            content: (
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-custom-text-300">{project?.identifier}</h4>
                    <span className="truncate">{issue?.name}</span>
                </div>
            ),
        }))

    const filteredOptions =
        searchTerm === "" ? options : options?.filter((o) => o.query.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleClose = () => {
        if (!isOpen) return
        setIsOpen(false)
    }

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen)
    }

    const dropdownOnChange = (val: string) => {
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
            className={cn("rounded", className)}
            value={value}
            onChange={dropdownOnChange}
            disabled={disabled}
            onKeyDown={handleKeyDown}
        >
            <Combobox.Button as={Fragment}>
                <button
                    ref={setReferenceElement}
                    type="button"
                    className={cn(
                        "clickable block h-full w-full outline-none",
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
                        tooltipHeading="Project"
                        tooltipContent={project?.name ?? "Related Issue"}
                        showTooltip={showTooltip}
                        variant={buttonVariant}
                    >
                        <h4 className="font-medium text-custom-text-300">{project?.identifier}</h4>
                        {BUTTON_VARIANTS_WITH_TEXT.includes(buttonVariant) && (
                            <span className="truncate">{issueMap[value]?.name ?? "Select related issue..."}</span>
                        )}
                    </DropdownButton>
                </button>
            </Combobox.Button>
            {isOpen && (
                <Combobox.Options className="fixed z-10" static>
                    <div
                        className="my-1 w-96 rounded border-[0.5px] border-custom-border-300 bg-custom-background-100 px-2 py-2.5 text-xs shadow-custom-shadow-rg focus:outline-none"
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search"
                                displayValue={(assigned: any) => assigned?.name}
                            />
                        </div>
                        <div className="mt-2 max-h-48 space-y-1 overflow-y-scroll">
                            {(!filteredOptions || (filteredOptions && filteredOptions.length === 0)) && (
                                <p className="text-custom-text-400 italic py-1 px-1.5">No issues found</p>
                            )}
                            {filteredOptions &&
                                filteredOptions.length > 0 &&
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
                                ))}
                        </div>
                    </div>
                </Combobox.Options>
            )}
        </Combobox>
    )
})
