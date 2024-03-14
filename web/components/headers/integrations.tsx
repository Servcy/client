import { Input, Select } from "antd"
import { AiOutlineApi } from "react-icons/ai"

import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"

import { uniqueIntegrationCategories } from "@constants/integration"

export const IntegrationsHeader = ({
    search,
    setSearch,
    setCategory,
}: {
    search: string
    setSearch: (search: string) => void
    setCategory: (category: string) => void
}) => (
    <div className="mb-6 h-[80px] rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200 hover:shadow-custom-shadow-4xl p-6">
        <div className="flex flex-row items-center">
            <SidebarHamburgerToggle className="mr-4" />
            <AiOutlineApi size="24" />
            <p className="truncate px-2 text-xl max-md:text-lg">Available Integrations</p>
            <Input
                className="ml-auto max-w-[200px]"
                value={search}
                placeholder="search by name..."
                onChange={(event) => setSearch(event.target.value || "")}
            />
            <Select
                className="ml-2 max-w-[200px]"
                placeholder="Filter by usage"
                allowClear={true}
                options={uniqueIntegrationCategories.map((category) => ({
                    label: category,
                    value: category,
                }))}
                onChange={(value) => setCategory(value)}
                onClear={() => setCategory("")}
            />
        </div>
    </div>
)
