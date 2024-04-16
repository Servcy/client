import { Flame, Gem, Sparkles } from "lucide-react"

export const offerings = [
    { text: "Unlimited Projects" },
    { text: "Unlimited Issues" },
    { text: "SSO, & Role based access" },
    { text: "AI Assistance" },
    { text: "Integration with Notion, Figma, Gmail & more" },
    { text: "Custom Analytics" },
    { text: "Feature Requests" },
    { text: "DORA metrics", comingSoon: true },
    { text: "APIs, & Webhooks", comingSoon: true },
    { text: "Slack & Github bot", comingSoon: true },
]

export const plans = {
    plus: {
        name: "Plus",
        description: "For startups that are making waves.",
        icon: "/plans/plus.svg",
        inrPrice: "6,499",
        usdPrice: "79",
        differentiators: ["Seats for upto 25 techies"],
        buttonVariant: "outline-primary",
        buttonIcon: Gem,
    },
    business: {
        name: "Business",
        description: "For businesses that are growing.",
        icon: "/plans/business.svg",
        buttonVariant: "primary",
        differentiators: ["Seats for upto 50 techies"],
        inrPrice: "9,999",
        buttonIcon: Sparkles,
        usdPrice: "119",
    },
    enterprise: {
        name: "Enterprise",
        description: "For enterprises that are scaling.",
        buttonVariant: "outline-primary",
        buttonIcon: Flame,
        differentiators: ["Seats for more than 50 techies"],
        icon: "/plans/enterprise.svg",
        inrPrice: "19,999",
        usdPrice: "249",
    },
}
