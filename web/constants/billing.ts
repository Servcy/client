import { BadgeDollarSign, BadgeIndianRupee, Flame, Gem, Sparkles } from "lucide-react"

export const plans = {
    plus: {
        name: "Plus",
        description: "For startups that are making waves.",
        icon: "/plans/plus.svg",
        inrPrice: "7,999",
        usdPrice: "99",
        buttonVariant: "outline-primary",
        offerings: [
            "Unlimited Projects",
            "Unlimited Cycles",
            "Unlimited Modules",
            "Collaborative Docs",
            "Native Time Tracking",
            "Timesheet",
            "Gantt, Spreadsheet & Calendar Layout",
            "Project Cost Analysis",
            "Unlimited Automations",
            "Inbox to Issue Conversion",
            "Fine-tune your Permissions",
            "Custom Analytics",
            "Custom Views",
            "Unlimited Storage",
            "Private Projects",
        ],
        buttonIcon: Gem,
    },
    business: {
        name: "Business",
        description: "For businesses that are growing.",
        icon: "/plans/business.svg",
        buttonVariant: "primary",
        inrPrice: "11,999",
        buttonIcon: Sparkles,
        usdPrice: "149",
        offerings: [
            "Invite Upto 25 Users",
            "Everything New",
            "Custom Analytics Export",
            "Project Deploy Boards",
            "AI Assistance",
            "Advanced Time Tracking",
            "Project Cost Estimation Export",
            "Feature Requests",
            "Priority Support",
        ],
    },
    enterprise: {
        name: "Enterprise",
        description: "For enterprises that are scaling.",
        buttonVariant: "outline-primary",
        buttonIcon: Flame,
        differentiators: ["Seats for more than 50 techies"],
        icon: "/plans/enterprise.svg",
        inrPrice: null,
        usdPrice: null,
        offerings: [
            "Invite Unlimited Users",
            "Custom Feature Implementation",
            "Dedicated backend server",
            "Dedicated sub-domain",
            "High speed data processing",
            "MSA, & HIPAA Compliance",
            "SLA & Uptime Guarantee",
            "Live Training Sessions",
            "Dedicated Relationship Manager",
            "Live Chat Support",
            "US, EU, APAC Data Residency",
            "Whiteglove Implementation",
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
