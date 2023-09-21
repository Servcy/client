"use client";

// Dependencies
import cn from "classnames";
import { useSearchParams } from "next/navigation.js";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
// Components
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import {
  AiFillPlusCircle,
  AiOutlineProject,
  AiOutlineSave,
} from "react-icons/ai";
// APIs
import { createProject, fetchProjects } from "@/apis/project";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const projectNameInputRef = useRef<HTMLInputElement>(null);

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

  const createNewProject = (event: any) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    if (!name) {
      toast.error("Project name is required");
      return;
    }
    if (!description) {
      toast.error("Project description is required");
      return;
    }
    setSaving(true);
    createProject({
      name,
      description,
    })
      .then((project) => {
        setProjects([...projects, project]);
        setTimeout(() => {
          setIsModalOpen(false);
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
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-slate-200 p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-white p-6">
        <div className="flex flex-row">
          <AiOutlineProject size="24" className="my-auto mr-2" />
          <p className="text-xl">Projects</p>
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <button onClick={() => setIsModalOpen(true)}>
          <div className="min-h-[400px] min-w-[300px] rounded-xl border border-gray-200 bg-white p-10 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <AiFillPlusCircle
              className={cn(
                "mx-auto my-10 h-1/2 w-1/2 text-green-300 dark:text-green-400",
                {
                  "animate-pulse":
                    tourStep === "add-project" || projects.length === 0,
                }
              )}
              size="48"
            />
            <p className="text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
              Add A New Project
            </p>
          </div>
        </button>
        {loading ? (
          <div className="flex min-h-[400px] min-w-[300px] animate-pulse flex-col rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="flex h-full flex-col justify-between p-10">
              <div className="flex-row">
                <div className="mb-6 h-6 w-1/3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-3 h-6 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-3 h-6 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-3 h-6 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-3 h-6 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <div role="status" className="mt-6 w-full flex-row">
                <svg
                  className="ml-auto h-10 w-10 text-gray-200 dark:text-gray-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"></path>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <>
            {projects.map((project) => (
              <div
                key={project.id}
                className="min-h-[400px] min-w-[300px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              ></div>
            ))}
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          size="lg"
          popup
          onClose={() => setIsModalOpen(false)}
          initialFocus={projectNameInputRef}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add a new project
              </h3>
              <form onSubmit={createNewProject}>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Project title" />
                </div>
                <TextInput
                  id="name"
                  ref={projectNameInputRef}
                  placeholder="Project #1"
                  required
                />
                <div className="mt-4 mb-2 block">
                  <Label htmlFor="description" value="Project description..." />
                </div>
                <Textarea
                  id="description"
                  required
                  placeholder="lorem ipsum..."
                  maxLength={500}
                />
                <Button
                  type="submit"
                  className="mt-8 w-full enabled:hover:text-green-500"
                  color="gray"
                  outline
                  isProcessing={saving}
                  size="sm"
                >
                  <span>Submit</span>
                  <AiOutlineSave size="18" className="ml-2" />
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </main>
  );
}
