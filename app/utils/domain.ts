export function getFaviconUrl(domain: string, fallback = "/favicon-placeholder.png"): string {
	try {
		if (!domain || !domain.includes(".")) {
			// domain is too short or invalid, return fallback immediately
			return fallback;
		}

		const cleanUrl = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
		return cleanUrl
			? `https://www.google.com/s2/favicons?domain=${cleanUrl}&sz=48`
			: fallback;
	} catch (err) {
		console.error("Failed to get favicon URL:", err);
		return fallback;
	}
}


/**
 * Extracts a clean, readable path from any URL.
 *
 * Examples:
 *   http://example.com/dashboard/stats?ref=home → "dashboard/stats"
 *   /projects/123/edit → "projects/123/edit"
 *   example.com → "/"
 *   invalid-url → "invalid-url"
 */
export function getReadablePath(url: string): string {
	try {
		// Handle both absolute and relative URLs
		const parsedUrl = new URL(url, 'http://dummy-base')
		const pathname = parsedUrl.pathname

		// Remove leading/trailing slashes
		const cleanPath = pathname.replace(/^\/+|\/+$/g, '')

		// Return "/" if root
		return cleanPath || '/'
	} catch {
		// If it's not a valid URL (e.g. malformed string), just return it
		return url
	}
}

/**
 * Optionally trims long paths for display
 * e.g. "dashboard/stats/details/deep" → "…/details/deep"
 */
export function shortenPath(path: string, maxSegments = 2): string {
	const parts = path.split('/').filter(Boolean)
	if (parts.length <= maxSegments) return path
	return `…/${parts.slice(-maxSegments).join('/')}`
}