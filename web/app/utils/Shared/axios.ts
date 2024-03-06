import Axios from "axios"
import Cookies from "js-cookie"

const SERVER_URL = process.env["NEXT_PUBLIC_SERVER_URL"]

export const refreshTokens = async () => {
    const accessToken = String(Cookies.get("accessToken") ?? "")
    return accessToken
}

export const axiosGet = async (url: string, params: Record<string, string>) => {
    const encodedParams = new URLSearchParams()
    Object.keys(params).forEach((key: string) => {
        encodedParams.append(key, params[key] ?? "")
    })
    const accessToken = await refreshTokens()
    const response = await Axios.get(`${SERVER_URL}${url}`, {
        params: encodedParams,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const { data } = response
    return data
}

export const axiosPost = async (url: string, payload: object) => {
    const accessToken = await refreshTokens()
    const response = await Axios.post(`${SERVER_URL}${url}`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const { data } = response
    return data
}

export const axiosPut = async (url: string, payload: object) => {
    const accessToken = await refreshTokens()
    const response = await Axios.put(`${SERVER_URL}${url}`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const { data } = response
    return data
}

export const axiosDelete = async (url: string) => {
    const accessToken = await refreshTokens()
    const response = await Axios.delete(`${SERVER_URL}${url}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const { data } = response
    return data
}

export const axiosPatch = async (url: string, payload: object) => {
    const accessToken = await refreshTokens()
    const response = await Axios.patch(`${SERVER_URL}${url}`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const { data } = response
    return data
}
