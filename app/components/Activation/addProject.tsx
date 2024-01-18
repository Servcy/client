"use client";

// Dependencies
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import AddClient from "@/components/Activation/addClient";
import DragDrop from "@/components/Shared/dragDrop";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Modal, Select, Spin } from "antd";
import { AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai";
// APIs
import { fetchClients } from "@/apis/client";
import { createProject } from "@/apis/project";
// Helpers
import { normFile } from "@/utils/Shared/files";
// Types
import { Client } from "@/types/client";
import { Project } from "@/types/projects";

const AddProject = ({
  isModalOpen,
  setIsModalOpen,
  refetchProjects,
}: {
  isModalOpen: boolean;

  setIsModalOpen: (isModalOpen: boolean) => void;
  refetchProjects?: () => void;
}) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [loadingClients, setLoadingClients] = useState<boolean>(false);
  const [fileList, setFileList] = useState<number[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState<string>("");
  const [fileNameIdMap, setFileNameIdMap] = useState<Record<string, number>>(
    {}
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddClientModalOpen, setIsAddClientModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoadingClients(true);
      fetchClients(clientSearch)
        .then((clients) => {
          setClients(clients);
        })
        .catch((error) => {
          toast.error(error.response.data.detail);
        })
        .finally(() => {
          setLoadingClients(false);
        });
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [clientSearch]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFileList([]);
    setFileNameIdMap({});
  };

  const createNewProject = () => {
    const name = document.getElementById("project-name") as HTMLInputElement;
    const description = document.getElementById(
      "project-description"
    ) as HTMLInputElement;
    const selectedClient = document.getElementById(
      "project-client"
    ) as HTMLInputElement;
    if (!selectedClient.value) {
      toast.error("Client is required");
      return;
    }
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
      client_id: clients.filter(
        (client) => client.name === selectedClient.value
      )[0]?.id,
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

  return isAddClientModalOpen ? (
    <AddClient
      isModalOpen={isAddClientModalOpen}
      setIsModalOpen={setIsAddClientModalOpen}
    />
  ) : (
    <Modal
      title="Add New Project"
      closeIcon={<AiOutlineCloseCircle size="24" color="servcy-black" />}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        closeModal();
      }}
      className="rounded-lg p-0"
      style={{ top: "50%", transform: "translateY(-50%)" }}
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
        <Form.Item>
          <Select
            placeholder="Select A Client"
            allowClear
            onClear={() => {
              const client = document.getElementById(
                "project-client"
              ) as HTMLInputElement;
              client.value = "";
            }}
            className="hover:!border-servcy-green focus:!border-servcy-green active:!border-servcy-green"
            dropdownRender={(menu) => (
              <>
                {loadingClients ? (
                  <div className="flex w-full items-center justify-center py-4">
                    <Spin
                      className="mx-auto"
                      indicator={
                        <SyncOutlined
                          spin
                          style={{
                            color: "#26542F",
                          }}
                        />
                      }
                    />
                  </div>
                ) : (
                  <>{menu}</>
                )}
                <Divider style={{ margin: "8px 0" }} />
                <div style={{ padding: "0 8px 4px" }} className="flex w-full">
                  <Input
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search A Client"
                    autoComplete="off"
                    id="project-client"
                  />
                  <Button
                    type="text"
                    className="ml-2"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddClientModalOpen(true)}
                  >
                    Add A Client
                  </Button>
                </div>
              </>
            )}
            options={clients.map((client) => ({
              label: client.name,
              value: client.id,
            }))}
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
              createNewProject();
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
