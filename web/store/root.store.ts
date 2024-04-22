import { enableStaticRendering } from "mobx-react-lite"

// root stores
import { AppRootStore, IAppRootStore } from "./application"
import { BillingStore, StoreIBillingStore } from "./billing.store"
import { CycleFilterStore, ICycleFilterStore } from "./cycle_filter.store"
import { CycleStore, ICycleStore } from "./cycle.store"
import { DashboardStore, IDashboardStore } from "./dashboard.store"
import { EstimateStore, IEstimateStore } from "./estimate.store"
import { EventTrackerStore, IEventTrackerStore } from "./event-tracker.store"
import { GlobalViewStore, IGlobalViewStore } from "./global-view.store"
import { IIssueRootStore, IssueRootStore } from "./issue/root.store"
import { ILabelStore, LabelStore } from "./label.store"
import { IMemberRootStore, MemberRootStore } from "./member"
import { IMentionStore, MentionStore } from "./mention.store"
import { IModuleFilterStore, ModuleFilterStore } from "./module_filter.store"
import { IModuleStore, ModulesStore } from "./module.store"
import { IProjectRootStore, ProjectRootStore } from "./project"
import { IProjectPageStore, ProjectPageStore } from "./project-page.store"
import { IProjectViewStore, ProjectViewStore } from "./project-view.store"
import { IStateStore, StateStore } from "./state.store"
import { ITimeTrackerStore, TimeTrackerStore } from "./time-tracker.store"
import { IUserRootStore, UserRootStore } from "./user"
import { StoreIWorkspaceStore, WorkspaceStore } from "./workspace"

enableStaticRendering(typeof window === "undefined")

export class RootStore {
    app: IAppRootStore
    eventTracker: IEventTrackerStore
    user: IUserRootStore
    workspace: StoreIWorkspaceStore
    billing: StoreIBillingStore
    projectRoot: IProjectRootStore
    memberRoot: IMemberRootStore
    cycle: ICycleStore
    moduleFilter: IModuleFilterStore
    module: IModuleStore
    projectView: IProjectViewStore
    globalView: IGlobalViewStore
    cycleFilter: ICycleFilterStore
    issue: IIssueRootStore
    state: IStateStore
    label: ILabelStore
    timer: ITimeTrackerStore
    estimate: IEstimateStore
    mention: IMentionStore
    dashboard: IDashboardStore
    projectPages: IProjectPageStore

    constructor() {
        this.app = new AppRootStore(this)
        this.eventTracker = new EventTrackerStore(this)
        this.user = new UserRootStore(this)
        this.projectRoot = new ProjectRootStore(this)
        this.memberRoot = new MemberRootStore(this)
        // independent stores
        this.workspace = new WorkspaceStore(this)
        this.cycle = new CycleStore(this)
        this.module = new ModulesStore(this)
        this.projectView = new ProjectViewStore(this)
        this.globalView = new GlobalViewStore(this)
        this.issue = new IssueRootStore(this)
        this.timer = new TimeTrackerStore(this)
        this.cycleFilter = new CycleFilterStore(this)
        this.state = new StateStore(this)
        this.moduleFilter = new ModuleFilterStore(this)
        this.billing = new BillingStore(this)
        this.label = new LabelStore(this)
        this.estimate = new EstimateStore(this)
        this.mention = new MentionStore(this)
        this.projectPages = new ProjectPageStore(this)
        this.dashboard = new DashboardStore(this)
    }

    resetOnSignout() {
        this.projectRoot = new ProjectRootStore(this)
        this.memberRoot = new MemberRootStore(this)
        // independent stores
        this.workspace = new WorkspaceStore(this)
        this.cycle = new CycleStore(this)
        this.module = new ModulesStore(this)
        this.cycleFilter = new CycleFilterStore(this)
        this.billing = new BillingStore(this)
        this.moduleFilter = new ModuleFilterStore(this)
        this.projectView = new ProjectViewStore(this)
        this.globalView = new GlobalViewStore(this)
        this.issue = new IssueRootStore(this)
        this.state = new StateStore(this)
        this.label = new LabelStore(this)
        this.estimate = new EstimateStore(this)
        this.timer = new TimeTrackerStore(this)
        this.mention = new MentionStore(this)
        this.projectPages = new ProjectPageStore(this)
        this.dashboard = new DashboardStore(this)
    }
}
