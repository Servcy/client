"use client";

// Dependencies
import cn from "classnames";
import { useSearchParams } from "next/navigation.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import DragDrop from "@/components/Shared/dragDrop";
import { Button, Form, Input, Modal, Skeleton } from "antd";
import {
  AiFillPlusCircle,
  AiOutlineCloseCircle,
  AiOutlineProject,
  AiOutlineSave,
} from "react-icons/ai";
// APIs
import { createProject, fetchProjects } from "@/apis/project";

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function Index(): JSX.Element {
  const searchParams = useSearchParams();
  const [tourStep, setTourStep] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
  const [fileList, setFileList] = useState<number[]>([]);
  const [fileNameIdMap, setFileNameIdMap] = useState<Record<string, number>>(
    {}
  );
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const tour_step = searchParams.get("tour_step");
    if (tour_step) {
      setTourStep(tour_step);
    }
    fetchProjects()
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const refetchProjects = () => {
    setLoading(true);
    fetchProjects()
      .then((projects) => {
        setProjects(projects);
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      file_list: fileList,
    })
      .then((project) => {
        setProjects([...projects, project]);
        setTimeout(() => {
          closeModal();
          toast.success("Project created successfully");
        }, 250);
        refetchProjects();
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex flex-row">
          <AiOutlineProject size="24" className="my-auto mr-2" />
          <p className="text-xl">Projects</p>
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <button onClick={() => setIsModalOpen(true)}>
          <div className="min-h-[250px] rounded-lg border border-servcy-gray bg-servcy-black p-5 shadow-sm">
            <AiFillPlusCircle
              className={cn("mx-auto my-10 h-1/3 w-1/4 text-servcy-light", {
                "animate-pulse":
                  tourStep === "add-project" || projects.length === 0,
              })}
              size="48"
            />
            <p className="text-center text-lg font-semibold text-servcy-gray">
              Add A New Project
            </p>
          </div>
        </button>
        {loading ? (
          <div className="min-h-[250px] rounded-lg border border-servcy-gray bg-servcy-white p-5 shadow-sm">
            <Skeleton
              avatar
              paragraph={{
                rows: 5,
              }}
            />
          </div>
        ) : (
          <>
            {projects.map((project) => (
              <div
                key={project.id}
                className="min-h-[250px] rounded-lg border border-servcy-gray bg-servcy-black p-4 shadow-sm"
              >
                <div className="mb-4 h-20">
                  <h5 className="mb-3 font-semibold tracking-tight">
                    {project.name}
                  </h5>
                  <p className="text-sm font-normal">{project.description}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal
          title="Add a new project"
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
                url="/project/upload"
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
                className="h-10 w-full rounded-lg !bg-servcy-black font-semibold !text-servcy-white hover:!border-servcy-light"
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
      )}
    </main>
  );
}
