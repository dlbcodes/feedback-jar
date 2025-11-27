export function detectIsMac(): boolean {
	if (!process.client) return false; // SSR-safe

	// Prefer new API (userAgentData)
	const nav = navigator as Navigator & {
		userAgentData?: {
			platform?: string
		}
	};

	if (nav.userAgentData?.platform) {
		return nav.userAgentData.platform.includes('Mac');
	}

	// Fallback to old API
	return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}
