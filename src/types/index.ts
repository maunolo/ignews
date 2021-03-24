import { Session } from "next-auth"

export type CustomSession = Session & {activeSubscription: object}