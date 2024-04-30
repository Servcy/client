import { Upload } from "antd"
import axios from "axios"
import Cookies from "js-cookie"
import toast from "react-hot-toast"

const UploadButton = ({
    onSave,
    beforeUpload,
    onRemove,
    showUploadList = true,
    setUploading,
    children,
}: {
    showUploadList?: boolean
    onSave: (_: any, __: string) => void
    beforeUpload: (_: any) => boolean
    onRemove: (_: any) => void
    setUploading: (_: boolean) => void
    children: React.ReactNode
}) => {
    const props = {
        multiple: true,
        showUploadList,
        beforeUpload,
        customRequest: async (options: any) => {
            const { onSuccess, onError, file } = options
            const fmData = new FormData()
            const accessToken = Cookies.get("accessToken")
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                    authorization: `Bearer ${accessToken}`,
                },
            }
            fmData.append("file", file)
            try {
                setUploading(true)
                const res = await axios.post(`${process.env["NEXT_PUBLIC_SERVER_URL"]}/document/upload`, fmData, config)
                onSuccess("Ok")
                onSave(res.data, file.name)
            } catch (err: any) {
                toast.error(err?.response?.data?.detail || "Some error occoured.")
                onError({ err: new Error("Some error") })
            } finally {
                setUploading(false)
            }
        },
        onChange() {},
        maxCount: 10,
        onRemove,
    }

    return <Upload {...props}>{children}</Upload>
}

export default UploadButton
