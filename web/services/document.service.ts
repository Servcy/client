import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

export interface UnSplashImage {
    id: string
    created_at: Date
    updated_at: Date
    promoted_at: Date
    width: number
    height: number
    color: string
    blur_hash: string
    description: null
    alt_description: string
    urls: UnSplashImageUrls
    [key: string]: any
}

export interface UnSplashImageUrls {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
    small_s3: string
}

export class FileService extends APIService {
    private cancelSource: any

    constructor() {
        super(API_BASE_URL)
        this.uploadFile = this.uploadFile.bind(this)
        this.deleteFile = this.deleteFile.bind(this)
        this.restoreFile = this.restoreFile.bind(this)
        this.cancelUpload = this.cancelUpload.bind(this)
    }

    cancelUpload() {
        this.cancelSource.cancel("Upload cancelled")
    }

    // getters

    getUploadFileFunction(workspaceId?: string): (file: File) => Promise<string> {
        return async (file: File) => {
            try {
                const formData = new FormData()
                formData.append("file", file)
                if (workspaceId) formData.append("workspace_id", workspaceId.toString())

                const data = await this.uploadFile(formData)
                return data.asset
            } catch (e) {
                console.error(e)
            }
        }
    }

    getDeleteImageFunction() {
        return async (src: string) => {
            try {
                const data = await this.deleteFile(src)
                return data
            } catch (e) {
                console.error(e)
            }
        }
    }

    getRestoreImageFunction() {
        return async (src: string) => {
            try {
                const data = await this.restoreFile(src)
                return data
            } catch (e) {
                console.error(e)
            }
        }
    }

    // document routes

    async uploadFile(file: FormData): Promise<any> {
        return this.post(`/document/upload`, file, {
            headers: {
                ...this.getHeaders(),
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteFile(assetUrl: string): Promise<any> {
        return this.delete(`/document/delete`, {
            file: assetUrl.substring(assetUrl.indexOf("/media/") + 7)
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restoreFile(assetUrl: string): Promise<any> {
        return this.post(`/document/restore`, {
            file: assetUrl.substring(assetUrl.indexOf("/media/") + 7)
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUnsplashImages(query?: string): Promise<UnSplashImage[]> {
        return this.get(`/document/unsplash`, {
            params: {
                query,
            },
        })
            .then((res) => res?.data?.results ?? res?.data)
            .catch((err) => {
                throw err?.response?.data
            })
    }
}
