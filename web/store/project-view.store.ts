import { set } from "lodash"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import { computedFn } from "mobx-utils"

import { ViewService } from "@services/view.service"

import { RootStore } from "@store/root.store"

import { IProjectView } from "@servcy/types"

export interface IProjectViewStore {
    //Loaders
    loader: boolean
    fetchedMap: Record<string, boolean>
    // observables
    viewMap: Record<string, IProjectView>
    // computed
    projectViewIds: string[] | null
    // computed actions
    getViewById: (viewId: string) => IProjectView
    // fetch actions
    fetchViews: (workspaceSlug: string, projectId: string) => Promise<undefined | IProjectView[]>
    fetchViewDetails: (workspaceSlug: string, projectId: string, viewId: string) => Promise<IProjectView>
    // CRUD actions
    createView: (workspaceSlug: string, projectId: string, data: Partial<IProjectView>) => Promise<IProjectView>
    updateView: (
        workspaceSlug: string,
        projectId: string,
        viewId: string,
        data: Partial<IProjectView>
    ) => Promise<IProjectView>
    deleteView: (workspaceSlug: string, projectId: string, viewId: string) => Promise<any>
    // favorites actions
    addViewToFavorites: (workspaceSlug: string, projectId: string, viewId: string) => Promise<any>
    removeViewFromFavorites: (workspaceSlug: string, projectId: string, viewId: string) => Promise<any>
}

export class ProjectViewStore implements IProjectViewStore {
    // observables
    loader: boolean = false
    viewMap: Record<string, IProjectView> = {}
    //loaders
    fetchedMap: Record<string, boolean> = {}
    // root store
    rootStore

    viewService

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            // observables
            loader: observable.ref,
            viewMap: observable,
            fetchedMap: observable,
            // computed
            projectViewIds: computed,
            // fetch actions
            fetchViews: action,
            fetchViewDetails: action,
            // CRUD actions
            createView: action,
            updateView: action,
            deleteView: action,
            // favorites actions
            addViewToFavorites: action,
            removeViewFromFavorites: action,
        })
        // root store
        this.rootStore = _rootStore

        this.viewService = new ViewService()
    }

    /**
     * Returns array of view ids for current project
     */
    get projectViewIds() {
        const projectId = this.rootStore.app.router.projectId
        if (!projectId || !this.fetchedMap[projectId]) return null
        const viewIds = Object.keys(this.viewMap ?? {})?.filter(
            (viewId) => this.viewMap?.[viewId]?.project.toString() === String(projectId)
        )
        return viewIds
    }

    /**
     * Returns view details by id
     */
    getViewById = computedFn((viewId: string) => this.viewMap?.[viewId] ?? ({} as IProjectView))

    /**
     * Fetches views for current project
     * @param workspaceSlug
     * @param projectId
     * @returns Promise<IProjectView[]>
     */
    fetchViews = async (workspaceSlug: string, projectId: string) => {
        try {
            this.loader = true
            await this.viewService.getViews(workspaceSlug, projectId).then((response) => {
                runInAction(() => {
                    response.forEach((view) => {
                        set(this.viewMap, [view.id], view)
                    })
                    set(this.fetchedMap, projectId, true)
                    this.loader = false
                })
                return response
            })
        } catch (error) {
            this.loader = false
            return undefined
        }
    }

    /**
     * Fetches view details for a specific view
     * @param workspaceSlug
     * @param projectId
     * @param viewId
     * @returns Promise<IProjectView>
     */
    fetchViewDetails = async (workspaceSlug: string, projectId: string, viewId: string): Promise<IProjectView> =>
        await this.viewService.getViewDetails(workspaceSlug, projectId, viewId).then((response) => {
            runInAction(() => {
                set(this.viewMap, [viewId], response)
            })
            return response
        })

    /**
     * Creates a new view for a specific project and adds it to the store
     * @param workspaceSlug
     * @param projectId
     * @param data
     * @returns Promise<IProjectView>
     */
    createView = async (workspaceSlug: string, projectId: string, data: Partial<IProjectView>): Promise<IProjectView> =>
        await this.viewService.createView(workspaceSlug, projectId, data).then((response) => {
            runInAction(() => {
                set(this.viewMap, [response.id], response)
            })
            return response
        })

    /**
     * Updates a view details of specific view and updates it in the store
     * @param workspaceSlug
     * @param projectId
     * @param viewId
     * @param data
     * @returns Promise<IProjectView>
     */
    updateView = async (
        workspaceSlug: string,
        projectId: string,
        viewId: string,
        data: Partial<IProjectView>
    ): Promise<IProjectView> => {
        const currentView = this.getViewById(viewId)
        return await this.viewService.patchView(workspaceSlug, projectId, viewId, data).then((response) => {
            runInAction(() => {
                set(this.viewMap, [viewId], { ...currentView, ...data })
            })
            return response
        })
    }

    /**
     * Deletes a view and removes it from the viewMap object
     * @param workspaceSlug
     * @param projectId
     * @param viewId
     * @returns
     */
    deleteView = async (workspaceSlug: string, projectId: string, viewId: string): Promise<any> => {
        await this.viewService.deleteView(workspaceSlug, projectId, viewId).then(() => {
            runInAction(() => {
                delete this.viewMap[viewId]
            })
        })
    }

    /**
     * Adds a view to favorites
     * @param workspaceSlug
     * @param projectId
     * @param viewId
     * @returns
     */
    addViewToFavorites = async (workspaceSlug: string, projectId: string, viewId: string) => {
        try {
            const currentView = this.getViewById(viewId)
            if (currentView?.is_favorite) return
            runInAction(() => {
                set(this.viewMap, [viewId, "is_favorite"], true)
            })
            await this.viewService.addViewToFavorites(workspaceSlug, projectId, {
                view: viewId,
            })
        } catch (error) {
            runInAction(() => {
                set(this.viewMap, [viewId, "is_favorite"], false)
            })
        }
    }

    /**
     * Removes a view from favorites
     * @param workspaceSlug
     * @param projectId
     * @param viewId
     * @returns
     */
    removeViewFromFavorites = async (workspaceSlug: string, projectId: string, viewId: string) => {
        try {
            const currentView = this.getViewById(viewId)
            if (!currentView?.is_favorite) return
            runInAction(() => {
                set(this.viewMap, [viewId, "is_favorite"], false)
            })
            await this.viewService.removeViewFromFavorites(workspaceSlug, projectId, viewId)
        } catch (error) {
            runInAction(() => {
                set(this.viewMap, [viewId, "is_favorite"], true)
            })
        }
    }
}
