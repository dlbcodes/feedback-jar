// composables/usePageMeta.ts
import { useRoute } from 'vue-router'
import { siteConfig } from '~/config/marketing'

export interface PageMetaOptions {
	title?: string
	description?: string
	image?: string
}

export function usePageMeta(options: PageMetaOptions = {}) {
	const runtimeConfig = useRuntimeConfig()
	const baseUrl = runtimeConfig.public.BASE_URL || ''
	const route = useRoute()

	const fullUrl = `${baseUrl}${route.path}`

	// ✅ Title logic: if no title provided, just use site name
	const fullTitle = options.title
		? `${options.title} | ${siteConfig.name}`
		: siteConfig.name

	const description = options.description || siteConfig.description
	const image = options.image || `${baseUrl}${siteConfig.defaultOgImage}`

	useHead({
		title: fullTitle,
		meta: [
			{ name: "description", content: description },
			{ property: "og:title", content: fullTitle },
			{ property: "og:description", content: description },
			{ property: "og:url", content: fullUrl },
			{ property: "og:type", content: "website" },
			{ property: "og:image", content: image },
			{ name: "twitter:title", content: fullTitle },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
			{ name: "twitter:card", content: "summary_large_image" },
		],
	})
}
