import type { SearchOptions, SearchResult } from "minisearch"
export type Document = {
	id: string | number
	title: string
	url?: string
	[key: string]: any
}

export interface UseSearchProps<T extends Document> {
	documents: T[]
	searchOptions?: SearchOptions
	fields: Extract<keyof T, string>[]
	storeFields: Extract<keyof T, string>[]
}

export type Result = SearchResult & { [key: string]: any }


export interface SearchComponentProps extends UseSearchProps<Document> {
	placeholder?: string
	onResultClick?: (result: Result) => void
	debounceMs?: number
	minQueryLength?: number
	showClearButton?: boolean
	emptyStateMessage?: string
	loadingMessage?: string
	className?: string
	resultClassName?: string
	renderResult?: (result: Result) => React.ReactNode
}
