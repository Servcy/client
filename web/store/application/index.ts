import { RootStore } from "@store/root.store"

import { CommandPaletteStore, ICommandPaletteStore } from "./command.store"
import { IRouterStore, RouterStore } from "./router.store"
import { IThemeStore, ThemeStore } from "./theme.store"

export interface IAppRootStore {
    commandPalette: ICommandPaletteStore
    theme: IThemeStore
    router: IRouterStore
}

export class AppRootStore implements IAppRootStore {
    commandPalette: ICommandPaletteStore
    theme: IThemeStore
    router: IRouterStore

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_rootStore: RootStore) {
        this.router = new RouterStore()
        this.commandPalette = new CommandPaletteStore()
        this.theme = new ThemeStore()
    }
}
