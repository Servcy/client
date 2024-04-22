export * from "./users"
export * from "./workspace"
export * from "./cycles"
export * from "./dashboard"
export * from "./projects"
export * from "./state"
export * from "./invitation"
export * from "./issues"
export * from "./modules"
export * from "./views"
export * from "./pages"
export * from "./ai"
export * from "./estimate"
export * from "./analytics"
export * from "./calendar"
export * from "./inbox"
export * from "./integration"
export * from "./external"
export * from "./jwt"
export * from "./timer-tracker"
export * from "./otp-input"
export * from "./notifications"
export * from "./waitlist"
export * from "./reaction"
export * from "./billing"
export * from "./view-props"
export * from "./workspace-views"
export * from "./webhook"
export * from "./issues/base"
export * from "./auth"
export * from "./app"

export type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? ObjectType[Key] extends { pop: any; push: any }
            ? `${Key}`
            : `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`
}[keyof ObjectType & (string | number)]
