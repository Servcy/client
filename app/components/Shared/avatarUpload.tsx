import { refreshTokens } from "@/utils/Shared/axios";
import { beforeUpload, getBase64 } from "@/utils/Shared/files";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadProps } from "antd/es/upload/interface";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const AvatarUpload = ({
  onSave,
  url,
}: {
  onSave: (_: any) => void;
  url: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj!, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const props = {
    multiple: false,
    showUploadList: false,
    beforeUpload,
    onChange: handleChange,
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
        onSave(res.data);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Some error occoured.");
        onError({ err: new Error("Some error") });
      }
    },
  };

  return (
    <Upload name="avatar" listType="picture-circle" {...props}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="avatar"
          width="100"
          height="100"
          className="rounded-xl hover:!border-servcy-green"
        />
      ) : (
        <div>
          {loading ? (
            <LoadingOutlined rev spin className="mx-auto" />
          ) : (
            <PlusOutlined rev className="mx-auto" />
          )}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
};

export default AvatarUpload;
