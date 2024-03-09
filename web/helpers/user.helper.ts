import { ERoles } from "@constants/iam"

export const getUserRole = (role: ERoles) => {
    switch (role) {
        case ERoles.GUEST:
            return "GUEST"
        case ERoles.VIEWER:
            return "VIEWER"
        case ERoles.MEMBER:
            return "MEMBER"
        case ERoles.ADMIN:
            return "ADMIN"
    }
}
