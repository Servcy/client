import Image from "next/image"
import React from "react"
// image
import JpgFileIcon from "public/attachment/jpg-icon.png"
// type
import type { ImageIconPros } from "./types"

export const JpgIcon: React.FC<ImageIconPros> = ({ width, height }) => (
    <Image src={JpgFileIcon} height={height} width={width} alt="JpgFileIcon" />
)
