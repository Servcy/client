import { useParams, usePathname } from "next/navigation"

import { useCallback, useEffect, useState } from "react"

const useReloadConfirmations = (isActive = true) => {
    const [showAlert, setShowAlert] = useState(false)
    const pathname = usePathname()
    const params = useParams()
    const handleBeforeUnload = useCallback(
        (event: BeforeUnloadEvent) => {
            if (!isActive || !showAlert) return
            event.preventDefault()
            confirm("Are you sure you want to leave? Changes you made may not be saved.")
            event.returnValue = ""
        },
        [isActive, showAlert]
    )
    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [handleBeforeUnload, pathname, params])

    return { setShowAlert }
}

export default useReloadConfirmations
