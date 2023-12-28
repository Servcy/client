"use client";

// Dependencies
import cn from "classnames";
import { useSearchParams } from "next/navigation.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import AddProject from "@/components/Activation/addProject";
import { Skeleton } from "antd";
import { AiFillPlusCircle, AiOutlineProject } from "react-icons/ai";
// APIs
import { fetchProjects } from "@/apis/project";
// Types
import { Project } from "@/types/projects";

export default function Index(): JSX.Element {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
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
              className={cn("mx-auto my-10 h-1/3 w-1/4 text-servcy-wheat", {
                "animate-pulse": projects.length === 0,
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
                className="min-h-[250px] rounded-lg border border-servcy-gray bg-servcy-black p-4 text-servcy-white shadow-sm"
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
        <AddProject
          isModalOpen={isModalOpen}
          refetchProjects={refetchProjects}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </main>
  );
}
