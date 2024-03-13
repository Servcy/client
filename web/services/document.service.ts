import axios from "axios"

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
        this.deleteImage = this.deleteImage.bind(this)
        this.restoreImage = this.restoreImage.bind(this)
        this.cancelUpload = this.cancelUpload.bind(this)
    }

    async uploadFile(workspaceSlug: string, file: FormData): Promise<any> {
        this.cancelSource = axios.CancelToken.source()
        return this.post(`/project/${workspaceSlug}/file-assets/`, file, {
            headers: {
                ...this.getHeaders(),
                "Content-Type": "multipart/form-data",
            },
            cancelToken: this.cancelSource.token,
        })
            .then((response) => response?.data)
            .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log(error.message)
                } else {
                    console.log(error)
                    throw error?.response?.data
                }
            })
    }

    cancelUpload() {
        this.cancelSource.cancel("Upload cancelled")
    }

    getUploadFileFunction(workspaceSlug: string): (file: File) => Promise<string> {
        return async (file: File) => {
            try {
                const formData = new FormData()
                formData.append("file", file)

                const data = await this.uploadFile(workspaceSlug, formData)
                return data.asset
            } catch (e) {
                console.error(e)
            }
        }
    }

    getDeleteImageFunction(workspaceId: string) {
        return async (src: string) => {
            try {
                const assetUrlWithWorkspaceId = `${workspaceId}/${this.extractAssetIdFromUrl(src, workspaceId)}`
                const data = await this.deleteImage(assetUrlWithWorkspaceId)
                return data
            } catch (e) {
                console.error(e)
            }
        }
    }

    getRestoreImageFunction(workspaceId: string) {
        return async (src: string) => {
            try {
                const assetUrlWithWorkspaceId = `${workspaceId}/${this.extractAssetIdFromUrl(src, workspaceId)}`
                const data = await this.restoreImage(assetUrlWithWorkspaceId)
                return data
            } catch (e) {
                console.error(e)
            }
        }
    }

    extractAssetIdFromUrl(src: string, workspaceId: string): string {
        const indexWhereAssetIdStarts = src.indexOf(workspaceId) + workspaceId.length + 1
        if (indexWhereAssetIdStarts === -1) {
            throw new Error("Workspace ID not found in source string")
        }
        const assetUrl = src.substring(indexWhereAssetIdStarts)
        return assetUrl
    }

    async deleteImage(assetUrlWithWorkspaceId: string): Promise<any> {
        return this.delete(`/project/file-assets/${assetUrlWithWorkspaceId}/`)
            .then((response) => response?.status)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restoreImage(assetUrlWithWorkspaceId: string): Promise<any> {
        return this.post(`/project/file-assets/${assetUrlWithWorkspaceId}/restore/`, {
            headers: this.getHeaders(),
            "Content-Type": "application/json",
        })
            .then((response) => response?.status)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteFile(workspaceId: string, assetUrl: string): Promise<any> {
        const lastIndex = assetUrl.lastIndexOf("/")
        const assetId = assetUrl.substring(lastIndex + 1)

        return this.delete(`/project/file-assets/${workspaceId}/${assetId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async uploadDocument(file: FormData): Promise<any> {
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

    async deleteDocument(assetUrl: string): Promise<any> {
        const lastIndex = assetUrl.lastIndexOf("/")
        const assetId = assetUrl.substring(lastIndex + 1)

        return this.delete(`/document/${assetId}`)
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

    async getProjectCoverImages(): Promise<string[]> {
        return this.get(`/project/project-covers/`)
            .then((res) => res?.data)
            .catch((err) => {
                throw err?.response?.data
            })
    }
}
