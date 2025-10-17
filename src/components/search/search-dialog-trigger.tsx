import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import * as React from "react"

export interface SearchTriggerProps {
	variant?: "default" | "outline" | "ghost" | "bar"
	className?: string
	placeholder?: string
}

export function SearchTrigger({
	variant = "bar",
	className,
	placeholder = "Search...",
}: SearchTriggerProps) {
	// Detect OS for keyboard shortcut display
	const [isMac, setIsMac] = React.useState(false)

	React.useEffect(() => {
		setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
	}, [])

	if (variant === "bar") {
		return (
			<div
				className={cn(
					"flex items-center gap-2 w-full max-w-md px-3 py-2 text-sm text-muted-foreground bg-background border rounded-md hover:border-foreground/20 transition-colors",
					className,
				)}
			>
				<Search className="h-4 w-4 shrink-0" />
				<span className="flex-1 text-left">{placeholder}</span>
				<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span> + K
				</kbd>
			</div>
		)
	}

	return (
		<Button
			variant={variant === "default" ? "default" : variant === "outline" ? "outline" : "ghost"}
			size="sm"
			className={cn("gap-2", className)}
		>
			<Search className="h-4 w-4" />
			<span>Search</span>
			<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex ml-1">
				<span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span> + K
			</kbd>
		</Button>
	)
}
