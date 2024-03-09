import { ERoles } from "@constants/iam"

export const getUserRole = (role: ERoles) => {
    switch (role) {
        case ERoles.GUEST:
            return "GUEST"
        case ERoles.MEMBER:
            return "MEMBER"
        case ERoles.ADMIN:
            return "ADMIN"
        case ERoles.OWNER:
            return "OWNER"
    }
}
