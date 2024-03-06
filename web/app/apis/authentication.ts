import Axios from "axios"
import jwtDecode from "jwt-decode"

const SERVER_URL = process.env["NEXT_PUBLIC_SERVER_URL"]

export const verifyOtp = async (otp: string, input: string, inputType: string) => {
    const response = Axios.post(`${SERVER_URL}/authentication`, {
        otp,
        input,
        input_type: inputType,
    })
    const { data } = await response
    return data
}

export const sendOtp = async (input: string, inputType: string) => {
    const response = Axios.get(`${SERVER_URL}/authentication?input=${input}&input_type=${inputType}`)
    const { data } = await response
    return data
}

export const googleLogin = async (credential: string) => {
    const response = Axios.post(`${SERVER_URL}/authentication`, {
        ...jwtDecode(credential),
        type: "google",
    })
    const { data } = await response
    return data
}

export const refreshTokens = async (refreshToken: string, setCookie: (key: string, value: string) => void) => {
    const response = Axios.post(`${SERVER_URL}/refresh-token`, {
        refresh: refreshToken,
    })
    const { data } = await response
    setCookie("accessToken", data.access)
    setCookie("refreshToken", data.refresh)
    return data
}
