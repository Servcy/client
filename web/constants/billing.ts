import { BadgeDollarSign, BadgeIndianRupee, Flame, Gem, Sparkles } from "lucide-react"

export const plans = {
    plus: {
        name: "Plus",
        description: "For startups that are making waves.",
        icon: "/plans/plus.svg",
        inrPrice: "7,999",
        addedBenefits: "Everything in Starter",
        usdPrice: "99",
        buttonVariant: "outline-primary",
        offerings: [
            "Invite Upto 10 Users",
            "Unlimited Projects",
            "Collaborative Docs",
            "Unlimited Automations",
            "Custom Role Permissions",
            "Custom Analytics",
            "Private Projects"
        ],
        buttonIcon: Gem,
    },
    business: {
        name: "Business",
        description: "For businesses that are growing.",
        icon: "/plans/business.svg",
        addedBenefits: "Everything in Plus",
        buttonVariant: "primary",
        inrPrice: "11,999",
        buttonIcon: Sparkles,
        usdPrice: "149",
        offerings: [
            "Invite Upto 25 Users",
            "Analytics Export",
            "Deploy Boards",
            "AI Assistance",
            "Unlimited Storage",
            "Cost Estimation Export"
        ],
    },
    enterprise: {
        name: "Enterprise",
        description: "For enterprises that are scaling.",
        buttonVariant: "outline-primary",
        addedBenefits: "Everything in Business",
        buttonIcon: Flame,
        differentiators: ["Seats for more than 50 techies"],
        icon: "/plans/enterprise.svg",
        inrPrice: null,
        usdPrice: null,
        offerings: [
            "Invite Unlimited Users",
            "High speed backend server",
            "MSA, & HIPAA Compliance",
            "SLA & Uptime Guarantee",
            "Dedicated Relationship Manager",
            "US, EU, APAC Data Residency"
        ],
    },
}

export const CURRENCY_CODES = [
    { code: "USD", icon: BadgeDollarSign },
    { code: "INR", icon: BadgeIndianRupee },
]

export const PLAN_LIMITS = {
    starter: {
        invitations: 5,
    },
}
