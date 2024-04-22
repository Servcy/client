import { useCallback, useState } from "react"

import { observer } from "mobx-react-lite"
import { useDropzone } from "react-dropzone"

import { MAX_FILE_SIZE } from "@constants/common"

import { generateFileName } from "@helpers/attachment.helper"

import { TSnapshotOperations } from "./StopTimeTrackerModal"

type TSnapshotOperationsModal = Exclude<TSnapshotOperations, "remove">

type Props = {
    workspaceSlug: string
    handleSnapshotOperations: TSnapshotOperationsModal
}

export const TimeTrackerSnapshotUpload: React.FC<Props> = observer((props) => {
    const { workspaceSlug, handleSnapshotOperations } = props
    // states
    const [isLoading, setIsLoading] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const currentFile: File = acceptedFiles[0] as File
        if (!currentFile || !workspaceSlug) return

        const uploadedFile: File = new File([currentFile], generateFileName(currentFile.name), {
            type: currentFile.type,
        })
        const formData = new FormData()
        formData.append("file", uploadedFile)
        formData.append(
            "meta_data",
            JSON.stringify({
                name: uploadedFile.name,
                size: uploadedFile.size,
            })
        )
        setIsLoading(true)
        handleSnapshotOperations.create(formData).finally(() => setIsLoading(false))
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        onDrop,
        maxSize: MAX_FILE_SIZE,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
        },
        multiple: false,
        disabled: isLoading,
    })

    const maxFileSize = MAX_FILE_SIZE

    const fileError =
        fileRejections.length > 0 ? `Invalid file type or size (max ${maxFileSize / 1024 / 1024} MB)` : null

    return (
        <div
            {...getRootProps()}
            className={`flex h-[60px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-custom-primary/5 px-4 text-xs text-custom-primary ${
                isDragActive ? "border-custom-primary bg-custom-primary/10" : "border-custom-border-200"
            } ${isDragReject ? "bg-red-100" : ""}`}
        >
            <input {...getInputProps()} />
            <span className="flex items-center gap-2">
                {isDragActive ? (
                    <p>Drop here...</p>
                ) : fileError ? (
                    <p className="text-center text-red-500">{fileError}</p>
                ) : isLoading ? (
                    <p className="text-center">Uploading...</p>
                ) : (
                    <p className="text-center">Click or drag a file here</p>
                )}
            </span>
        </div>
    )
})
