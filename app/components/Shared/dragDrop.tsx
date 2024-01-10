import { refreshTokens } from "@/utils/Shared/axios";
import InboxOutlined from "@ant-design/icons/lib/icons/InboxOutlined";
import { Upload } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const Dragger = Upload.Dragger;

const DragDrop = ({
  onSave,
  onRemove,
  url,
}: {
  onSave: (_: any, __: string) => void;
  onRemove: (_: any) => void;
  url: string;
}) => {
  const props = {
    multiple: true,
    customRequest: async (options: any) => {
      const { onSuccess, onError, file } = options;
      const fmData = new FormData();
      const accessToken = await refreshTokens();
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          authorization: `Bearer ${accessToken}`,
        },
      };
      fmData.append("file", file);
      try {
        const res = await axios.post(
          `${process.env["NEXT_PUBLIC_SERVER_URL"]}${url}`,
          fmData,
          config
        );
        onSuccess("Ok");
        onSave(res.data, file.name);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Some error occoured.");
        onError({ err: new Error("Some error") });
      }
    },
    onChange(info: any) {
      const status = info.file.status;
      if (status === "done") {
        toast.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    maxCount: 10,
    onRemove,
  };

  return (
    <Dragger {...props}>
      <p>
        <InboxOutlined />
      </p>
      <p>Click or drag file to this area to upload</p>
    </Dragger>
  );
};

export default DragDrop;
