import { action, computed, makeObservable, observable } from "mobx"

import { EIssuesStoreType, TCreateModalStoreTypes } from "@constants/issue"

import { PageService } from "@services/page.service"
import { ProjectService } from "@services/project"

export interface ModalData {
    store: EIssuesStoreType
    viewId: string
}

export interface ICommandPaletteStore {
    // observables
    isCommandPaletteOpen: boolean
    isShortcutModalOpen: boolean
    isCreateProjectModalOpen: boolean
    isCreateCycleModalOpen: boolean
    isUpgradePlanModalOpen: boolean
    isCreateModuleModalOpen: boolean
    isCreateViewModalOpen: boolean
    isCreatePageModalOpen: boolean
    isWorkspaceViewCreateModalOpen: boolean
    isCreateIssueModalOpen: boolean
    isDeleteIssueModalOpen: boolean
    isBulkDeleteIssueModalOpen: boolean
    isTimeTrackerModalOpen: boolean
    // computed
    isAnyModalOpen: boolean
    // toggle actions
    toggleTimeTrackerModal: (value?: boolean) => void
    toggleCommandPaletteModal: (value?: boolean) => void
    toggleShortcutModal: (value?: boolean) => void
    toggleCreateProjectModal: (value?: boolean) => void
    toggleCreateCycleModal: (value?: boolean) => void
    toggleCreateViewModal: (value?: boolean) => void
    toggleWorkspaceViewCreateModal: (value?: boolean) => void
    toggleUpgradePlanModal: (value?: boolean) => void
    toggleCreatePageModal: (value?: boolean) => void
    toggleCreateIssueModal: (value?: boolean, storeType?: TCreateModalStoreTypes) => void
    toggleCreateModuleModal: (value?: boolean) => void
    toggleDeleteIssueModal: (value?: boolean) => void
    toggleBulkDeleteIssueModal: (value?: boolean) => void

    createIssueStoreType: TCreateModalStoreTypes
}

export class CommandPaletteStore implements ICommandPaletteStore {
    // observables
    isCommandPaletteOpen: boolean = false
    isShortcutModalOpen: boolean = false
    isCreateProjectModalOpen: boolean = false
    isCreateCycleModalOpen: boolean = false
    isCreateModuleModalOpen: boolean = false
    isUpgradePlanModalOpen: boolean = false
    isTimeTrackerModalOpen: boolean = false
    isCreateViewModalOpen: boolean = false
    isCreatePageModalOpen: boolean = false
    isWorkspaceViewCreateModalOpen: boolean = false
    isCreateIssueModalOpen: boolean = false
    isDeleteIssueModalOpen: boolean = false
    isBulkDeleteIssueModalOpen: boolean = false
    // service
    projectService
    pageService

    createIssueStoreType: TCreateModalStoreTypes = EIssuesStoreType.PROJECT

    constructor() {
        makeObservable(this, {
            // observable
            isCommandPaletteOpen: observable.ref,
            isShortcutModalOpen: observable.ref,
            isUpgradePlanModalOpen: observable.ref,
            isCreateProjectModalOpen: observable.ref,
            isCreateCycleModalOpen: observable.ref,
            isCreateModuleModalOpen: observable.ref,
            isCreateViewModalOpen: observable.ref,
            isCreatePageModalOpen: observable.ref,
            isTimeTrackerModalOpen: observable.ref,
            isCreateIssueModalOpen: observable.ref,
            isDeleteIssueModalOpen: observable.ref,
            isBulkDeleteIssueModalOpen: observable.ref,
            isWorkspaceViewCreateModalOpen: observable.ref,
            // computed
            isAnyModalOpen: computed,
            // toggle actions
            toggleCommandPaletteModal: action,
            toggleShortcutModal: action,
            toggleCreateProjectModal: action,
            toggleWorkspaceViewCreateModal: action,
            toggleCreateCycleModal: action,
            toggleCreateViewModal: action,
            toggleCreatePageModal: action,
            toggleUpgradePlanModal: action,
            toggleCreateIssueModal: action,
            toggleCreateModuleModal: action,
            toggleTimeTrackerModal: action,
            toggleDeleteIssueModal: action,
            toggleBulkDeleteIssueModal: action,
        })

        this.projectService = new ProjectService()
        this.pageService = new PageService()
    }

    /**
     * Checks whether any modal is open or not.
     * @returns boolean
     */
    get isAnyModalOpen() {
        return Boolean(
            this.isCreateIssueModalOpen ||
                this.isCreateCycleModalOpen ||
                this.isCreatePageModalOpen ||
                this.isCreateProjectModalOpen ||
                this.isTimeTrackerModalOpen ||
                this.isCreateModuleModalOpen ||
                this.isWorkspaceViewCreateModalOpen ||
                this.isCreateViewModalOpen ||
                this.isShortcutModalOpen ||
                this.isUpgradePlanModalOpen ||
                this.isBulkDeleteIssueModalOpen ||
                this.isDeleteIssueModalOpen
        )
    }

    /**
     * Toggles the time tracker modal
     * @param value
     * @returns
     */
    toggleTimeTrackerModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isTimeTrackerModalOpen = value
        } else {
            this.isTimeTrackerModalOpen = !this.isTimeTrackerModalOpen
        }
    }

    /**
     * Toggles the command palette modal
     * @param value
     * @returns
     */
    toggleCommandPaletteModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isCommandPaletteOpen = value
        } else {
            this.isCommandPaletteOpen = !this.isCommandPaletteOpen
        }
    }

    /**
     * Toggles the shortcut modal
     * @param value
     * @returns
     */
    toggleShortcutModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isShortcutModalOpen = value
        } else {
            this.isShortcutModalOpen = !this.isShortcutModalOpen
        }
    }

    /**
     * Toggles the upgrade plan modal
     * @param value
     * @returns
     */
    toggleUpgradePlanModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isUpgradePlanModalOpen = value
        } else {
            this.isUpgradePlanModalOpen = !this.isUpgradePlanModalOpen
        }
    }

    /**
     * Toggles the create project modal
     * @param value
     * @returns
     */
    toggleCreateProjectModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isCreateProjectModalOpen = value
        } else {
            this.isCreateProjectModalOpen = !this.isCreateProjectModalOpen
        }
    }

    /**
     * Toggles the create cycle modal
     * @param value
     * @returns
     */
    toggleCreateCycleModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isCreateCycleModalOpen = value
        } else {
            this.isCreateCycleModalOpen = !this.isCreateCycleModalOpen
        }
    }

    /**
     * Toggles the create view modal
     * @param value
     * @returns
     */
    toggleCreateViewModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isCreateViewModalOpen = value
        } else {
            this.isCreateViewModalOpen = !this.isCreateViewModalOpen
        }
    }

    /*
     * Toggles the workspace view create modal
     * @param value
     * @returns
     */
    toggleWorkspaceViewCreateModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isWorkspaceViewCreateModalOpen = value
        } else {
            this.isWorkspaceViewCreateModalOpen = !this.isWorkspaceViewCreateModalOpen
        }
    }

    /**
     * Toggles the create page modal
     * @param value
     * @returns
     */
    toggleCreatePageModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isCreatePageModalOpen = value
        } else {
            this.isCreatePageModalOpen = !this.isCreatePageModalOpen
        }
    }

    /**
     * Toggles the create issue modal
     * @param value
     * @param storeType
     * @returns
     */
    toggleCreateIssueModal = (value?: boolean, storeType?: TCreateModalStoreTypes) => {
        if (value !== undefined) {
            this.isCreateIssueModalOpen = value
            this.createIssueStoreType = storeType || EIssuesStoreType.PROJECT
        } else {
            this.isCreateIssueModalOpen = !this.isCreateIssueModalOpen
            this.createIssueStoreType = EIssuesStoreType.PROJECT
        }
    }

    /**
     * Toggles the delete issue modal
     * @param value
     * @returns
     */
    toggleDeleteIssueModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isDeleteIssueModalOpen = value
        } else {
            this.isDeleteIssueModalOpen = !this.isDeleteIssueModalOpen
        }
    }

    /**
     * Toggles the create module modal
     * @param value
     * @returns
     */
    toggleCreateModuleModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isCreateModuleModalOpen = value
        } else {
            this.isCreateModuleModalOpen = !this.isCreateModuleModalOpen
        }
    }

    /**
     * Toggles the bulk delete issue modal
     * @param value
     * @returns
     */
    toggleBulkDeleteIssueModal = (value?: boolean) => {
        if (value !== undefined) {
            this.isBulkDeleteIssueModalOpen = value
        } else {
            this.isBulkDeleteIssueModalOpen = !this.isBulkDeleteIssueModalOpen
        }
    }
}
