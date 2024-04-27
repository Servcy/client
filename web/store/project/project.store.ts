import set from "lodash/set"
import sortBy from "lodash/sortBy"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import { computedFn } from "mobx-utils"

import { IssueLabelService, IssueService } from "@services/issue"
import { ProjectArchiveService, ProjectExpenseService, ProjectService, ProjectStateService } from "@services/project"

import { orderProjects, shouldFilterProject } from "@helpers/project.helper"

import { IProject } from "@servcy/types"

import { RootStore } from "../root.store"

export interface IProjectStore {
    // observables
    projectMap: {
        [projectId: string]: IProject // projectId: project Info
    }
    // computed
    filteredProjectIds: string[] | undefined
    workspaceProjectIds: string[] | undefined
    archivedProjectIds: string[] | undefined
    totalProjectIds: string[] | undefined
    joinedProjectIds: string[]
    favoriteProjectIds: string[]
    currentProjectDetails: IProject | undefined
    // actions
    getProjectById: (projectId: string) => IProject | null
    getProjectIdentifierById: (projectId: string) => string
    getJoinedProjectIdsForWorkspace: (workspaceId: string) => string[]
    // fetch actions
    fetchProjects: (workspaceSlug: string) => Promise<IProject[]>
    fetchProjectDetails: (workspaceSlug: string, projectId: string) => Promise<IProject>
    // favorites actions
    addProjectToFavorites: (workspaceSlug: string, projectId: string) => Promise<any>
    removeProjectFromFavorites: (workspaceSlug: string, projectId: string) => Promise<any>
    // project-view action
    updateProjectView: (workspaceSlug: string, projectId: string, viewProps: any) => Promise<any>
    // CRUD actions
    createProject: (workspaceSlug: string, data: Partial<IProject>) => Promise<IProject>
    updateProject: (workspaceSlug: string, projectId: string, data: Partial<IProject>) => Promise<IProject>
    deleteProject: (workspaceSlug: string, projectId: string) => Promise<void>
    // archive actions
    archiveProject: (workspaceSlug: string, projectId: string) => Promise<void>
    restoreProject: (workspaceSlug: string, projectId: string) => Promise<void>
}

export class ProjectStore implements IProjectStore {
    // observables
    projectMap: {
        [projectId: string]: IProject // projectId: project Info
    } = {}
    // root store
    rootStore: RootStore
    // service
    projectService
    projectArchiveService
    issueLabelService
    issueService
    stateService
    projectExpenseService

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            projectMap: observable,
            filteredProjectIds: computed,
            workspaceProjectIds: computed,
            archivedProjectIds: computed,
            totalProjectIds: computed,
            currentProjectDetails: computed,
            joinedProjectIds: computed,
            favoriteProjectIds: computed,
            fetchProjects: action,
            fetchProjectDetails: action,
            addProjectToFavorites: action,
            removeProjectFromFavorites: action,
            updateProjectView: action,
            createProject: action,
            updateProject: action,
        })
        this.rootStore = _rootStore
        this.projectService = new ProjectService()
        this.projectArchiveService = new ProjectArchiveService()
        this.issueService = new IssueService()
        this.issueLabelService = new IssueLabelService()
        this.stateService = new ProjectStateService()
        this.projectExpenseService = new ProjectExpenseService()
    }

    /**
     * @description returns filtered projects based on filters and search query
     */
    get filteredProjectIds() {
        const workspaceDetails = this.rootStore.workspace.currentWorkspace
        const {
            currentWorkspaceDisplayFilters: displayFilters,
            currentWorkspaceFilters: filters,
            searchQuery,
        } = this.rootStore.projectRoot.projectFilter
        if (!workspaceDetails || !displayFilters || !filters) return
        let workspaceProjects = Object.values(this.projectMap).filter(
            (_project) =>
                _project.workspace.toString() === workspaceDetails.id.toString() &&
                (_project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    _project.identifier.toLowerCase().includes(searchQuery.toLowerCase())) &&
                shouldFilterProject(_project, displayFilters, filters)
        )
        workspaceProjects = orderProjects(workspaceProjects, displayFilters.order_by)
        return workspaceProjects.map((_project) => _project.id)
    }

    /**
     * Returns project IDs belong to the current workspace
     */
    get workspaceProjectIds() {
        const workspaceDetails = this.rootStore.workspace.currentWorkspace
        if (!workspaceDetails) return
        const workspaceProjects = Object.values(this.projectMap).filter((p) => p.workspace === workspaceDetails.id)
        const projectIds = workspaceProjects.map((p) => p.id)
        return projectIds ?? null
    }

    /**
     * Returns archived project IDs belong to current workspace.
     */
    get archivedProjectIds() {
        const currentWorkspace = this.rootStore.workspace.currentWorkspace
        if (!currentWorkspace) return

        let projects = Object.values(this.projectMap ?? {})
        projects = sortBy(projects, "archived_at")

        const projectIds = projects
            .filter(
                (project) => project.workspace.toString() === currentWorkspace.id.toString() && !!project.archived_at
            )
            .map((project) => project.id)
        return projectIds
    }

    /**
     * Returns total project IDs belong to the current workspace
     */
    // workspaceProjectIds + archivedProjectIds
    get totalProjectIds() {
        const currentWorkspace = this.rootStore.workspace.currentWorkspace
        if (!currentWorkspace) return

        const workspaceProjects = this.workspaceProjectIds ?? []
        const archivedProjects = this.archivedProjectIds ?? []
        return [...workspaceProjects, ...archivedProjects]
    }

    /**
     * Returns current project details
     */
    get currentProjectDetails() {
        if (!this.rootStore.app.router.projectId) return
        return this.projectMap?.[this.rootStore.app.router.projectId]
    }

    /**
     * Returns joined project IDs belong to the current workspace
     */
    get joinedProjectIds() {
        const currentWorkspace = this.rootStore.workspace.currentWorkspace
        if (!currentWorkspace) return []

        let projects = Object.values(this.projectMap ?? {})
        projects = sortBy(projects, "sort_order")

        const projectIds = projects
            .filter(
                (project) =>
                    project.workspace.toString() === currentWorkspace.id.toString() &&
                    project.is_member &&
                    !project.archived_at
            )
            .map((project) => project.id)
        return projectIds
    }

    /**
     * Returns favorite project IDs belong to the current workspace
     */
    get favoriteProjectIds() {
        const currentWorkspace = this.rootStore.workspace.currentWorkspace
        if (!currentWorkspace) return []

        let projects = Object.values(this.projectMap ?? {})
        projects = sortBy(projects, "created_at")

        const projectIds = projects
            .filter(
                (project) =>
                    project.workspace === currentWorkspace.id &&
                    project.is_member &&
                    project.is_favorite &&
                    !project.archived_at
            )
            .map((project) => project.id)
        return projectIds
    }

    /**
     * get Workspace projects using workspace slug
     * @param workspaceSlug
     * @returns Promise<IProject[]>
     *
     */
    fetchProjects = async (workspaceSlug: string) => {
        try {
            const projectsResponse = await this.projectService.getProjects(workspaceSlug)
            runInAction(() => {
                projectsResponse.forEach((project) => {
                    set(this.projectMap, [project.id], project)
                })
            })
            return projectsResponse
        } catch (error) {
            throw error
        }
    }

    /**
     * Fetches project details using workspace slug and project id
     * @param workspaceSlug
     * @param projectId
     * @returns Promise<IProject>
     */
    fetchProjectDetails = async (workspaceSlug: string, projectId: string) => {
        try {
            const response = await this.projectService.getProject(workspaceSlug, projectId)
            runInAction(() => {
                set(this.projectMap, [projectId], response)
            })
            return response
        } catch (error) {
            throw error
        }
    }

    /**
     * Returns project details using project id
     * @param projectId
     * @returns IProject | null
     */
    getProjectById = computedFn((projectId: string) => {
        const projectInfo = this.projectMap[projectId] || null
        return projectInfo
    })

    /**
     * Returns project identifier using project id
     * @param projectId
     * @returns string
     */
    getProjectIdentifierById = computedFn((projectId: string) => {
        const projectInfo = this.projectMap?.[projectId]
        return projectInfo?.identifier
    })

    /**
     * Returns joined project IDs for the workspace using workspace id
     * @param workspaceId
     * @returns string[]
     */
    getJoinedProjectIdsForWorkspace = computedFn((workspaceId: string) => {
        const projects = Object.values(this.projectMap ?? {})
        const projectIds = projects
            .filter((project) => project.workspace.toString() === workspaceId.toString() && project.is_member)
            .map((project) => project.id)
        return projectIds
    })

    /**
     * Adds project to favorites and updates project favorite status in the store
     * @param workspaceSlug
     * @param projectId
     * @returns
     */
    addProjectToFavorites = async (workspaceSlug: string, projectId: string) => {
        try {
            const currentProject = this.getProjectById(projectId)
            if (currentProject.is_favorite) return
            runInAction(() => {
                set(this.projectMap, [projectId, "is_favorite"], true)
            })
            const response = await this.projectService.addProjectToFavorites(workspaceSlug, projectId)
            return response
        } catch (error) {
            runInAction(() => {
                set(this.projectMap, [projectId, "is_favorite"], false)
            })
            throw error
        }
    }

    /**
     * Removes project from favorites and updates project favorite status in the store
     * @param workspaceSlug
     * @param projectId
     * @returns
     */
    removeProjectFromFavorites = async (workspaceSlug: string, projectId: string) => {
        try {
            const currentProject = this.getProjectById(projectId)
            if (!currentProject.is_favorite) return
            runInAction(() => {
                set(this.projectMap, [projectId, "is_favorite"], false)
            })
            const response = await this.projectService.removeProjectFromFavorites(workspaceSlug, projectId)
            await this.fetchProjects(workspaceSlug)
            return response
        } catch (error) {
            runInAction(() => {
                set(this.projectMap, [projectId, "is_favorite"], true)
            })
            throw error
        }
    }

    /**
     * Updates the project view
     * @param workspaceSlug
     * @param projectId
     * @param viewProps
     * @returns
     */
    updateProjectView = async (workspaceSlug: string, projectId: string, viewProps: { sort_order: number }) => {
        const currentProjectSortOrder = this.getProjectById(projectId)?.sort_order
        try {
            runInAction(() => {
                set(this.projectMap, [projectId, "sort_order"], viewProps?.sort_order)
            })
            const response = await this.projectService.setProjectView(workspaceSlug, projectId, viewProps)
            return response
        } catch (error) {
            runInAction(() => {
                set(this.projectMap, [projectId, "sort_order"], currentProjectSortOrder)
            })
            throw error
        }
    }

    /**
     * Creates a project in the workspace and adds it to the store
     * @param workspaceSlug
     * @param data
     * @returns Promise<IProject>
     */
    createProject = async (workspaceSlug: string, data: any) => {
        try {
            const response = await this.projectService.createProject(workspaceSlug, data)
            runInAction(() => {
                set(this.projectMap, [response.id], response)
                set(
                    this.rootStore.user.membership.workspaceProjectsRole,
                    [workspaceSlug, response.id],
                    response.member_role
                )
            })
            return response
        } catch (error) {
            throw error
        }
    }

    /**
     * Updates a details of a project and updates it in the store
     * @param workspaceSlug
     * @param projectId
     * @param data
     * @returns Promise<IProject>
     */
    updateProject = async (workspaceSlug: string, projectId: string, data: Partial<IProject>) => {
        try {
            const projectDetails = this.getProjectById(projectId)
            runInAction(() => {
                set(this.projectMap, [projectId], { ...projectDetails, ...data })
            })
            const response = await this.projectService.updateProject(workspaceSlug, projectId, data)
            return response
        } catch (error) {
            this.fetchProjects(workspaceSlug)
            this.fetchProjectDetails(workspaceSlug, projectId)
            throw error
        }
    }

    /**
     * Deletes a project from specific workspace and deletes it from the store
     * @param workspaceSlug
     * @param projectId
     * @returns Promise<void>
     */
    deleteProject = async (workspaceSlug: string, projectId: string) => {
        try {
            if (!this.projectMap?.[projectId]) return
            await this.projectService.deleteProject(workspaceSlug, projectId)
            runInAction(() => {
                delete this.projectMap[projectId]
            })
        } catch (error) {
            this.fetchProjects(workspaceSlug)
        }
    }

    /**
     * Archives a project from specific workspace and updates it in the store
     * @param workspaceSlug
     * @param projectId
     * @returns Promise<void>
     */
    archiveProject = async (workspaceSlug: string, projectId: string) => {
        await this.projectArchiveService
            .archiveProject(workspaceSlug, projectId)
            .then((response) => {
                runInAction(() => {
                    set(this.projectMap, [projectId, "archived_at"], response.archived_at)
                })
            })
            .catch((error) => {
                this.fetchProjects(workspaceSlug)
                this.fetchProjectDetails(workspaceSlug, projectId)
                throw error
            })
    }

    /**
     * Restores a project from specific workspace and updates it in the store
     * @param workspaceSlug
     * @param projectId
     * @returns Promise<void>
     */
    restoreProject = async (workspaceSlug: string, projectId: string) => {
        await this.projectArchiveService
            .restoreProject(workspaceSlug, projectId)
            .then(() => {
                runInAction(() => {
                    set(this.projectMap, [projectId, "archived_at"], null)
                })
            })
            .catch((error) => {
                this.fetchProjects(workspaceSlug)
                this.fetchProjectDetails(workspaceSlug, projectId)
                throw error
            })
    }
}
