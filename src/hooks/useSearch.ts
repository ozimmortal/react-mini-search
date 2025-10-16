import type { SearchResult } from "minisearch"
import MiniSearch from "minisearch"
import { useMemo, useState } from "react"
import type { Document, UseSearchProps } from "../lib/type"

export function useSearch<T extends Document>(props: UseSearchProps<T>) {
	const [results, setResults] = useState<(SearchResult & Partial<T>)[]>([])

	const minisearch = useMemo(() => {
		const searchinstance = new MiniSearch({
			fields: props.fields,
			storeFields: props.storeFields,
			searchOptions: props.searchOptions,
		})
		searchinstance.addAllAsync(props.documents)
		return searchinstance
	}, [props.fields, props.storeFields, props.searchOptions, props.documents])

	const search = (term: string) => {
		if (!term) return
		const results = minisearch.search(term, {
			prefix: true,
			fuzzy: 0.3,
			...props.searchOptions,
		})
		setResults(results as (SearchResult & Partial<T>)[])
	}

	const clearSearch = () => {
		setResults([])
	}

	return { search, results, clearSearch }
}
