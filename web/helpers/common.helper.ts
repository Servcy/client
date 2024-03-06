import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const debounce = (func: any, wait: number, immediate: boolean = false) => {
    let timeout: any

    return function executedFunction(...args: any) {
        const later = () => {
            timeout = null
            if (!immediate) func(...args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func(...args)
    }
}

export const API_BASE_URL = process.env["NEXT_PUBLIC_SERVER_URL"] ? process.env["NEXT_PUBLIC_SERVER_URL"] : ""

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getQueryParams = (search: string) => {
    const params = new URLSearchParams(search)
    return Array.from(params.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

export function isMobileDevice(userAgent: string): boolean {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    return isMobile
}

export function getCleanLink(url: string) {
    const anchor = document.createElement("a")
    anchor.href = url
    /*
    Input: https://example.com/path/to/resource?param=value#section
    Outputs: https://example.com/path/to/resource
    Return the clean link (host + pathname) without query parameters, or fragment
  */
    return anchor.protocol + "//" + anchor.host + anchor.pathname
}
