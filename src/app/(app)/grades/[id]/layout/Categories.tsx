import type { Category } from "@/hooks/useGrades"
import NumberFlow from "@number-flow/react"

interface CategoryProps {
    category: Category
    current: boolean
    set: () => void
}
function Category(props: CategoryProps) {
    const { category, current, set } = props
    const { name, weight, calculated } = category
    return (
        <div
            className={`flex -z-10 rounded-lg ${current ? "bg-primary" : "bg-tertiary"} hover:scale-105 hover:shadow-2xl hover:cursor-pointer transition ease-out duration-200`}
            onClick={set}
        >
            <div className={`flex w-full p-4 ${current && "text-tertiary"}`}>
                <div className="flex space-x-1.5 w-2/3 pr-2">
                    <p className="truncate">
                        {name}
                    </p>
                    {!!weight && (
                        <p className="text-secondary font-medium">
                            ({weight}%)
                        </p>
                    )}
                </div>
                {calculated && (
                    <NumberFlow
                        className="font-semibold w-1/3 text-right"
                        value={calculated}
                        suffix="%"
                        continuous
                    />
                )}
            </div>
        </div>
    )
}

interface CategoriesProps {
    category: string
    categories: Category[]
    setCategory: (id: string) => void
}
export default function Categories(props: CategoriesProps) {
    const { category, categories, setCategory } = props
    return (
        <div className="w-1/4 px-3 pt-3 min-w-56 space-y-2.5 overflow-y-auto rounded-lg">
            {categories
                .sort((a, b) => b.weight - a.weight)
                .map(c => (
                    <Category
                        key={c.id}
                        category={c}
                        current={c.id === category}
                        set={() => setCategory(c.id)}
                    />
                ))}
        </div>
    )
}