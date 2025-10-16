import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/hooks/useSearch"
import type { Result, SearchComponentProps } from "@/lib/type"
import { cn } from "@/lib/utils"
import { Loader2, Search, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function InlineSearch({
	documents,
	fields,
	storeFields,
	searchOptions,
	placeholder = "Search...",
	onResultClick,
	debounceMs = 300,
	minQueryLength = 2,
	showClearButton = true,
	emptyStateMessage = "No results found",
	loadingMessage = "Searching...",
	className,
	resultClassName,
	renderResult,
}: SearchComponentProps) {
	const [query, setQuery] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [hasSearched, setHasSearched] = useState(false)

	// use your hook
	const { search, results, clearSearch } = useSearch({
		documents,
		fields,
		storeFields,
		searchOptions,
	})

	const performSearch = useCallback(
		(term: string) => {
			if (term.length < minQueryLength) {
				clearSearch()
				setHasSearched(false)
				return
			}

			setIsLoading(true)
			setHasSearched(true)

			try {
				search(term)
			} catch (error) {
				console.error("Search error:", error)
			} finally {
				setIsLoading(false)
			}
		},
		[search, clearSearch, minQueryLength],
	)

	useEffect(() => {
		const timer = setTimeout(() => {
			performSearch(query)
		}, debounceMs)

		return () => clearTimeout(timer)
	}, [query, debounceMs, performSearch])

	const handleClear = () => {
		setQuery("")
		clearSearch()
		setHasSearched(false)
	}

	const handleResultClick = (result: Result) => {
		if (onResultClick) {
			onResultClick(result)
		}
	}

	const defaultRenderResult = (result: Result) => (
		<button
			key={result.id}
			onClick={() => handleResultClick(result)}
			className={cn(
				"w-full text-left p-4 hover:bg-accent transition-colors rounded-lg group",
				resultClassName,
			)}
			type="button"
		>
			<div className="flex gap-3">
				{result.metadata?.thumbnail && (
					<div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted">
						<img
							src={result.metadata.thumbnail || "/placeholder.svg"}
							alt={result.title}
							className="w-full h-full object-cover"
						/>
					</div>
				)}
				<div className="flex-1 min-w-0">
					<h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
						{result.title}
					</h3>
					{result.description && (
						<p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
					)}
					{result.metadata && (
						<div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
							{result.metadata.author && <span>{result.metadata.author}</span>}
							{result.metadata.author && result.metadata.date && <span>•</span>}
							{result.metadata.date && <span>{result.metadata.date}</span>}
							{result.metadata.category && (
								<>
									<span>•</span>
									<span className="text-primary">{result.metadata.category}</span>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</button>
	)

	return (
		<div className={cn("w-full max-w-3xl mx-auto", className)}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					placeholder={placeholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-9 pr-9 h-11"
				/>
				{showClearButton && query && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClear}
						className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Clear search</span>
					</Button>
				)}
			</div>

			{query.length >= minQueryLength && (
				<div className="mt-4 border rounded-lg bg-card">
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							<span className="ml-2 text-sm text-muted-foreground">{loadingMessage}</span>
						</div>
					) : results.length > 0 ? (
						<div className="divide-y">
							{results.map((result) =>
								renderResult ? renderResult(result) : defaultRenderResult(result),
							)}
						</div>
					) : hasSearched ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<p className="text-sm text-muted-foreground">{emptyStateMessage}</p>
							<p className="text-xs text-muted-foreground mt-1">Try adjusting your search query</p>
						</div>
					) : null}
				</div>
			)}
		</div>
	)
}
