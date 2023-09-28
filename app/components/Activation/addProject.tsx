"use client";

// Dependencies
import { useState } from "react";
import toast from "react-hot-toast";
// Components
import DragDrop from "@/components/Shared/dragDrop";
import { Button, Form, Input, Modal } from "antd";
import { AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai";
// APIs
import { createProject } from "@/apis/project";
// Helpers
import { normFile } from "@/utils/Shared/files";
// Types
import { Project } from "@/types/projects";

const AddProject = ({
  isModalOpen,
  setIsModalOpen,
  refetchProjects,
}: {
  isModalOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsModalOpen: (isModalOpen: boolean) => void;
  refetchProjects?: () => void;
}) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [fileList, setFileList] = useState<number[]>([]);
  const [fileNameIdMap, setFileNameIdMap] = useState<Record<string, number>>(
    {}
  );
  const [projects, setProjects] = useState<Project[]>([]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFileList([]);
    setFileNameIdMap({});
  };

  const createNewClient = () => {
    const name = document.getElementById("project-name") as HTMLInputElement;
    const description = document.getElementById(
      "project-description"
    ) as HTMLInputElement;
    if (!name.value) {
      toast.error("Project name is required");
      return;
    }
    if (!description.value) {
      toast.error("Project description is required");
      return;
    }
    setSaving(true);
    createProject({
      name: name.value,
      description: description.value,
      file_ids: fileList,
    })
      .then((project) => {
        setProjects([...projects, project]);
        setTimeout(() => {
          closeModal();
          toast.success("Project created successfully");
        }, 250);
        if (refetchProjects) refetchProjects();
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
      title="Add New Project"
      closeIcon={<AiOutlineCloseCircle size="24" color="servcy-black" />}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        closeModal();
      }}
      className="rounded-lg p-0"
    >
      <Form layout="vertical" className="mt-5" preserve={false}>
        <Form.Item label="Name">
          <Input
            id="project-name"
            className="hover:!border-servcy-black focus:!border-servcy-black active:!border-servcy-black"
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            rows={3}
            id="project-description"
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

export default AddProject;
