import jwtDecode from "jwt-decode"

import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { ILoginTokenResponse } from "@servcy/types"

export class AuthService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async verifyOtp(otp: string, input: string, inputType: string): Promise<ILoginTokenResponse> {
        return this.post(
            "/authentication",
            {
                otp,
                input,
                input_type: inputType,
            },
            { headers: {} }
        )
            .then((response) => {
                this.setAccessToken(response?.data?.access_token)
                this.setRefreshToken(response?.data?.refresh_token)
                return response?.data
            })
            .catch((error) => {
                throw error?.response?.data
            })
    }
    async sendOtp(input: string, inputType: string): Promise<object> {
        return this.get(`/authentication?input=${input}&input_type=${inputType}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
    async googleLogin(credential: string): Promise<ILoginTokenResponse> {
        return this.post(
            "/authentication",
            {
                ...jwtDecode(credential),
                type: "google",
            },
            { headers: {} }
        )
            .then((response) => {
                this.setAccessToken(response?.data?.access_token)
                this.setRefreshToken(response?.data?.refresh_token)
                return response?.data
            })
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async logOut(): Promise<any> {
        return this.post("/logout", { refresh_token: this.getRefreshToken() })
            .then((response) => {
                this.purgeAccessToken()
                this.purgeRefreshToken()
                return response?.data
            })
            .catch((error) => {
                this.purgeAccessToken()
                this.purgeRefreshToken()
                throw error?.response?.data
            })
    }
}
