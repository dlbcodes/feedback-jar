import { useMagicKeys, whenever } from '@vueuse/core';

export function useAppShortcut(combo: string, callback: () => void) {
	onMounted(() => {
		const isMac = detectIsMac();
		const finalCombo = combo.replace(/Cmd/i, isMac ? 'Meta' : 'Ctrl');

		const browserReserved = [
			'Meta+Shift+A', 'Ctrl+Shift+A',
			'Meta+R', 'Ctrl+R',
			'Meta+W', 'Ctrl+W',
			'Meta+T', 'Ctrl+T',
		];
		if (browserReserved.includes(finalCombo)) {
			console.warn(`[useAppShortcut] Shortcut "${finalCombo}" may be reserved by the browser.`);
		}

		const keys = useMagicKeys();
		const shortcutRef = keys[finalCombo];
		whenever(shortcutRef, callback);
	});
}
