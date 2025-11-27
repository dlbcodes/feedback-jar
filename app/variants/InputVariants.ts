import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva("", {
	variants: {
		variant: {
			primary:
				"group flex items-center gap-x-2 bg-stone-100 text-stone-950 font-medium w-full transition-all duration-100 ease-linear border-2 border-transparent disabled:cursor-not-allowed disable:opacity-50 dark:bg-dark-900 dark:text-dark-200",
			secondary: "",
			outline: "",
			contrast: "group flex items-center gap-x-2 bg-stone-200 text-stone-950 font-medium w-full transition-all duration-100 ease-linear border-2 border-transparent disabled:cursor-not-allowed disable:opacity-50 dark:bg-dark-950 dark:text-dark-200"
		},
		size: {
			xl: "",
			lg: "",
			base: "h-12 px-3.5 rounded-xl",
			sm: "h-9 px-0.5 text-sm rounded-lg",
			xs: "",
			icon: "",
			none: "",
			checkbox: "h-6 w-6",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "base",
	},
});



export type InputProps = VariantProps<typeof inputVariants>;