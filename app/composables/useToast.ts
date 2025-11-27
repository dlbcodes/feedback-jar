import { ref } from "vue";

export interface Toast {
	id: number;
	title?: string;
	message: string;
	type?: "success" | "error" | "warning" | "info";
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
	duration: number;
}

// Global reactive state - works across the entire app
const toasts = ref<Toast[]>([]);

export const useToast = () => {
	const addToast = (message: string, options: Partial<Toast> = {}) => {
		const id = Date.now() + Math.random(); // More unique ID
		const toast: Toast = {
			id,
			title: options.title || "",
			message,
			type: options.type || "info",
			position: options.position || "bottom-right",
			duration: options.duration || 3000,
		};

		toasts.value.push(toast);

		// Auto-remove toast after duration
		setTimeout(() => {
			removeToast(id);
		}, toast.duration);

		return id; // Return ID in case you want to manually remove it
	};

	const removeToast = (id: number) => {
		const index = toasts.value.findIndex((t) => t.id === id);
		if (index > -1) {
			toasts.value.splice(index, 1);
		}
	};

	const clearAllToasts = () => {
		toasts.value = [];
	};

	return {
		addToast,
		removeToast,
		clearAllToasts,
		toasts: readonly(toasts), // Expose as readonly
	};
};

// Separate composable for the ToastProvider component
export const useToastState = () => toasts;