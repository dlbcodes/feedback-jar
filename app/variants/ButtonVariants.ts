import { cva, type VariantProps } from "class-variance-authority";

// Define base styles
const baseStyles = "group flex items-center cursor-pointer transition-all  disabled:text-white/40 disabled:cursor-not-allowed disabled:stroke-white/40";

// Use class variance authority with the Vue approach
export const buttonVariants = cva(baseStyles, {
	variants: {
		variant: {
			primary: `
                    w-full bg-indigo-600 text-white stroke-white font-semibold shadow-button-active px-6 
                    duration-100 ease-linear hover:shadow-button-hover
                    dark:bg-indigo-600
                    disabled:text-white/40 disabled:cursor-not-allowed disabled:stroke-white/40
                `,
			secondary: `
                    w-full text-black bg-stone-50 stroke-black font-semibold shadow-button-secondary-active px-6 
                    duration-100 ease-linear hover:shadow-button-secondary-hover
                `,
			outline: `
                    text-sm px-3.5 py-2.5 text-black/70 rounded-lg duration-100 ease-linear border border-stone-200 bg-white
                    hover:text-black hover:bg-black hover:bg-opacity-5
                `,
			link: `
                    inline-flex text-purple-600 duration-200 ease-in-out hover:underline
                `,
			destructive: `
                    w-full bg-red-500 text-white font-semibold shadow-destructive px-6 
                    duration-100 ease-linear hover:shadow-destructive-hover
                `,
			icon: "relative inline-grid place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10",
			ghost: `
                    text-sm p-2.5 text-black rounded-lg duration-100 ease-linear 
                    hover:text-black hover:bg-black hover:bg-opacity-5
                `,
			ghostWhite: `
                bg-white text-sm p-2.5 text-black rounded-lg duration-100 ease-linear
                [&>svg]:w-4 [&>svg]:h-4 shrink-0
                hover:text-red-800
            `,
		},
		size: {
			xl: "h-14 text-base font-semibold rounded-xl",
			lg: "h-12 text-base rounded-xl",
			base: "h-10 text-sm rounded-xl",
			sm: "h-8 text-sm rounded-lg",
			xs: "",
			icon: "p-1.5",
			"icon-sm": "p-1",
		},
		loading: {
			true: "opacity-50 cursor-not-allowed",
			false: "",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "base",
		loading: false,
	},
});

export type ButtonProps = VariantProps<typeof buttonVariants>;
