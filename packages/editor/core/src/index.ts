// import "./styles/tailwind.css";
import "src/styles/editor.css";
import "src/styles/table.css";
import "src/styles/github-dark.css";

export { isCellSelection } from "src/ui/extensions/table/table/utilities/is-cell-selection";

export * from "src/lib/utils";
export * from "src/ui/extensions/table/table";
export { startImageUpload } from "src/ui/plugins/upload-file";

export { EditorContainer } from "src/ui/components/editor-container";
export { EditorContentWrapper } from "src/ui/components/editor-content";

export { useEditor } from "src/hooks/use-editor";
export { useReadOnlyEditor } from "src/hooks/use-read-only-editor";

export * from "src/ui/menus/menu-items";
export * from "src/lib/editor-commands";

export type { DeleteFile } from "src/types/delete-file";
export type { UploadFile } from "src/types/upload-file";
export type { RestoreFile } from "src/types/restore-file";
export type { IMentionHighlight, IMentionSuggestion } from "src/types/mention-suggestion";
export type { ISlashCommandItem, CommandProps } from "src/types/slash-commands-suggestion";
export type { LucideIconType } from "src/types/lucide-icon";
