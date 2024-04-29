import dynamic from "next/dynamic"

import { FC } from "react"

const GaugeComponent = dynamic(() => import("react-gauge-component"), { ssr: false })

export const GaugeChart: FC<{
    value: number
}> = ({ value }) => (
    <GaugeComponent
        value={value}
        type="radial"
        labels={{
            tickLabels: {
                type: "inner",
                ticks: [{ value: 50 }, { value: 100 }],
            },
        }}
        arc={{
            colorArray: ["#CDCED6", "#80838D", "#3E9B4F", "#FFC53D", "#E5484D"],
            subArcs: [{ limit: 10 }, { limit: 25 }, { limit: 50 }, { limit: 75 }, { limit: 100 }],
            padding: 0.02,
            width: 0.3,
        }}
        pointer={{
            elastic: true,
            animationDelay: 0,
        }}
    />
)
