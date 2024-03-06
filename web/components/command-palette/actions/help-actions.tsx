import { useApplication } from "@hooks/store"
import { Command } from "cmdk"
import { MessageSquare, Rocket } from "lucide-react"

type Props = {
    closePalette: () => void
}

export const CommandPaletteHelpActions: React.FC<Props> = (props) => {
    const { closePalette } = props

    const {
        commandPalette: { toggleShortcutModal },
    } = useApplication()

    return (
        <Command.Group heading="Help">
            <Command.Item
                onSelect={() => {
                    closePalette()
                    toggleShortcutModal(true)
                }}
                className="focus:outline-none"
            >
                <div className="flex items-center gap-2 text-custom-text-200">
                    <Rocket className="h-3.5 w-3.5" />
                    Open keyboard shortcuts
                </div>
            </Command.Item>
            <Command.Item
                onSelect={() => {
                    closePalette()
                    ;(window as any)?.$crisp.push(["do", "chat:open"])
                }}
                className="focus:outline-none"
            >
                <div className="flex items-center gap-2 text-custom-text-200">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Chat with us
                </div>
            </Command.Item>
        </Command.Group>
    )
}
