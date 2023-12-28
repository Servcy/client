"use client";

// Dependencies
import { useState } from "react";
import toast from "react-hot-toast";
// Components
import AvatarUpload from "@/components/Shared/avatarUpload";
import DragDrop from "@/components/Shared/dragDrop";
import { Button, Form, Input, Modal } from "antd";
import { AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai";
// APIs
import { createClient } from "@/apis/client";
// Helpers
import { normFile } from "@/utils/Shared/files";
import {
  validateEmail,
  validatePhone,
  validateWebUrl,
} from "@/utils/Shared/validators";

const AddClient = ({
  isModalOpen,
  setIsModalOpen,
  refreshClients,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  refreshClients?: () => void;
}) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [fileList, setFileList] = useState<number[]>([]);
  const [avatar, setAvatar] = useState<Number | null>(null);
  const [fileNameIdMap, setFileNameIdMap] = useState<Record<string, number>>(
    {}
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setFileList([]);
    setFileNameIdMap({});
  };

  const createNewClient = () => {
    const name = document.getElementById("client-name") as HTMLInputElement;
    if (!name.value) {
      toast.error("Client name is required");
      return;
    }
    const email = document.getElementById("client-email") as HTMLInputElement;
    if (email.value && !validateEmail(email.value)) {
      toast.error("Please enter a valid email");
      return;
    }
    const phone = document.getElementById("client-phone") as HTMLInputElement;
    if (phone.value && !validatePhone(phone.value)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const website = document.getElementById(
      "client-website"
    ) as HTMLInputElement;
    if (website.value && !validateWebUrl(website.value)) {
      toast.error("Please enter a valid website");
      return;
    }
    const address = document.getElementById(
      "client-address"
    ) as HTMLInputElement;
    const notes = document.getElementById("client-notes") as HTMLInputElement;
    setSaving(true);
    createClient({
      name: name.value,
      notes: notes.value,
      email: email.value,
      phone: phone.value,
      website: website.value,
      address: address.value,
      avatar: avatar,
      file_ids: fileList,
    })
      .then(() => {
        setTimeout(() => {
          closeModal();
          toast.success("Client created successfully");
          if (refreshClients) refreshClients();
        }, 250);
      })
      .catch(() => {
        toast.error("Something went wrong, please try again later!");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Modal
      title="Add New Client"
      closeIcon={<AiOutlineCloseCircle size="24" color="servcy-black" />}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        closeModal();
      }}
      className="min-w-[600px] rounded-lg p-0"
    >
      <Form layout="vertical" className="mt-5" preserve={false}>
        <div className="flex justify-between">
          <div className="w-1/2 flex-col">
            <Form.Item label="Name">
              <Input
                id="client-name"
                placeholder="John Doe"
                className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                id="client-email"
                placeholder="abc@company.com"
                className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
              />
            </Form.Item>
          </div>
          <Form.Item label="Logo" className="w-1/3 flex-col">
            <AvatarUpload
              url="/client/avatar"
              onSave={(data: any) => {
                setAvatar(parseInt(JSON.parse(data.results).avatar_id));
              }}
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Phone">
            <Input
              id="client-phone"
              placeholder="+123456789"
              className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
            />
          </Form.Item>
          <Form.Item label="Website">
            <Input
              id="client-website"
              placeholder="www.company.com"
              className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
            />
          </Form.Item>
        </div>
        <Form.Item label="Address">
          <Input.TextArea
            rows={2}
            id="client-address"
            placeholder="431 Bakers Street, London, UK"
            className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
          />
        </Form.Item>
        <Form.Item label="Notes">
          <Input.TextArea
            rows={3}
            id="client-notes"
            placeholder="Important notes..."
            className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
          />
        </Form.Item>
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
          <DragDrop
            onSave={(data, fileName) => {
              const fileIds = JSON.parse(data.results).file_ids;
              setFileList((prevState) => [...prevState, ...fileIds]);
              setFileNameIdMap((prevState) => ({
                ...prevState,
                [fileName]: fileIds[0],
              }));
            }}
            url="/client/upload"
            onRemove={(file: any) => {
              const fileName = file.name;
              const fileId = fileNameIdMap[fileName];
              setFileList((prevState) =>
                prevState.filter((id) => id !== fileId)
              );
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="h-10 w-full rounded-lg !bg-servcy-black font-semibold !text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
            icon={<AiOutlineSave size="14" className="my-auto" />}
            onClick={() => {
              createNewClient();
            }}
            loading={saving}
            disabled={saving}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClient;
