"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearch } from "@/hooks/useSearch"
import type { Result, SearchComponentProps } from "@/lib/type"
import { cn } from "@/lib/utils"
import { ExternalLink, FileText, Search } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { SearchTrigger } from "./search-dialog-trigger"

export interface SearchDialogProps extends SearchComponentProps {
	onResultSelect?: (result: Result) => void
	categories?: string[]
	showCategories?: boolean
	trigger?: React.ReactNode
}

export function SearchDialog({
	documents,
	fields,
	storeFields,
	searchOptions,
	placeholder = "Search documentation...",
	emptyStateMessage = "No results found.",
	loadingMessage = "Searching...",
	debounceMs = 300,
	className,
	onResultSelect,
	trigger,
}: SearchDialogProps) {
	const [query, setQuery] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)

	// Keyboard shortcut
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((prev) => !prev)
			}
			if (e.key === "Escape") setOpen(false)
		}
		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	const onOpenChange = useCallback((v: boolean) => setOpen(v), [])

	const { search, results, clearSearch } = useSearch({
		documents,
		fields,
		storeFields,
		searchOptions,
	})

	// Debounced search
	useEffect(() => {
		if (!query.trim()) {
			clearSearch()
			setIsLoading(false)
			return
		}
		setIsLoading(true)
		const timer = setTimeout(() => {
			try {
				search(query)
				setSelectedIndex(0)
			} catch (err) {
				console.error("Search error:", err)
				clearSearch()
			} finally {
				setIsLoading(false)
			}
		}, debounceMs)
		return () => clearTimeout(timer)
	}, [query, debounceMs])

	// Reset when modal closes
	useEffect(() => {
		if (!open) {
			setQuery("")
			clearSearch()
			setSelectedIndex(0)
		}
	}, [open])

	// focus input without scrolling
	useLayoutEffect(() => {
		if (open) {
			try {
				inputRef.current?.focus({ preventScroll: true })
			} catch {
				setTimeout(() => inputRef.current?.focus(), 0)
			}
		}
	}, [open])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!results.length) return
		if (e.key === "ArrowDown" && selectedIndex <= results.length - 1) {
			e.preventDefault()
			setSelectedIndex((prev) => (prev + 1) % results.length)
			console.log("results", results, " selectedIndex", selectedIndex)
		} else if (e.key === "ArrowUp" && selectedIndex >= 0) {
			e.preventDefault()
			setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
			console.log("results", results, " selectedIndex", selectedIndex)
		} else if (e.key === "Enter" && results[selectedIndex]) {
			e.preventDefault()
			handleResultClick(results[selectedIndex])
		}
	}

	const handleResultClick = (result: Result) => {
		if (onResultSelect) onResultSelect(result)
		if (result.url) window.location.href = result.url
		setOpen(false)
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<div onClick={() => setOpen(true)} className="w-full">
					{trigger || <SearchTrigger variant="bar" placeholder={placeholder} />}
				</div>
			</DialogTrigger>

			{/* fixed centered modal — top 50% / translateY(-50%) prevents vertical jumps as content height changes */}
			<DialogContent
				className={cn(
					"fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen ",
					" rounded-lg shadow-2xl border border-border bg-background ",
					"min-h-[220px] max-h-[70vh] top-[30vh] ",
					className,
				)}
			>
				<DialogHeader className="sr-only">
					<DialogTitle>Search</DialogTitle>
					<DialogDescription>Search documentation</DialogDescription>
				</DialogHeader>

				<div className="w-full flex flex-col  rounded-lg " onKeyDown={handleKeyDown}>
					{/* input row (fixed height) */}
					<div className="flex items-center gap-2 px-4 h-12 shrink-0 border-b w-full ">
						<InputWithIcon
							ref={inputRef as any}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={placeholder}
							icon={<Search className="w-4 h-4" />}
							iconPosition="left"
							className="mb-2"
						/>
					</div>

					<div className="flex-1 min-h-0 max-h-64 ">
						<ScrollArea className={cn("h-full")}>
							{isLoading ? (
								<div className="py-6 text-center text-sm text-muted-foreground">
									{loadingMessage}
								</div>
							) : query && results.length === 0 ? (
								<div className="py-6 text-center text-sm text-muted-foreground">
									{emptyStateMessage}
								</div>
							) : (
								<div className="py-2 flex flex-col gap-1">
									{results.map((result, index) => {
										return (
											<Button
												key={result.id || `${index}`}
												onClick={() => handleResultClick(result)}
												className={cn(
													"w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors",
													index === selectedIndex && "bg-accent",
												)}
												type="button"
												variant="ghost"
											>
												<div className="mt-0.5 shrink-0 text-muted-foreground">
													{result.icon || <FileText className="h-4 w-4" />}
												</div>
												<div className="flex-1 min-w-0">
													<div className="font-medium text-sm mb-0.5">
														{result.title} - {index}
													</div>
													{result.description && (
														<div className="text-xs text-muted-foreground line-clamp-2">
															{result.description}
														</div>
													)}
												</div>
												{result.url && (
													<ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground mt-1" />
												)}
											</Button>
										)
									})}
								</div>
							)}
						</ScrollArea>
					</div>
				</div>
				{/* input row (fixed height) */}

				{/* results (scrollable area) */}

				{/* footer */}
			</DialogContent>
		</Dialog>
	)
}
