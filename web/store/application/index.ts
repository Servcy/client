import { RootStore } from "@store/root.store"
import { EventTrackerStore, IEventTrackerStore } from "../event-tracker.store"
import { AppConfigStore, IAppConfigStore } from "./app-config.store"
import { CommandPaletteStore, ICommandPaletteStore } from "./command-palette.store"
// import { EventTrackerStore, IEventTrackerStore } from "./event-tracker.store";
import { IInstanceStore, InstanceStore } from "./instance.store"
import { IRouterStore, RouterStore } from "./router.store"
import { IThemeStore, ThemeStore } from "./theme.store"

export interface IAppRootStore {
    config: IAppConfigStore
    commandPalette: ICommandPaletteStore
    instance: IInstanceStore
    theme: IThemeStore
    router: IRouterStore
}

export class AppRootStore implements IAppRootStore {
    config: IAppConfigStore
    commandPalette: ICommandPaletteStore
    instance: IInstanceStore
    theme: IThemeStore
    router: IRouterStore

    constructor(_rootStore: RootStore) {
        this.router = new RouterStore()
        this.config = new AppConfigStore()
        this.commandPalette = new CommandPaletteStore()
        this.instance = new InstanceStore()
        this.theme = new ThemeStore()
    }
}
