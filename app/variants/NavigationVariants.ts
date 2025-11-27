import { cva, type VariantProps } from "class-variance-authority";

export const navigationVariants = cva("disabled:cursor-not-allowed", {
	variants: {
		variant: {
			primary: "group cursor-pointer font-mono flex items-center justify-between w-full text-sm/6 whitespace-nowrap p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-dark-950/80 text-stone-950 dark:text-dark-400 aria-[current=page]:bg-stone-100 aria-[current=page]:text-stone-950 aria-[current=page]:dark:text-dark-200 aria-[current=page]:dark:bg-dark-950/80",
			// primary: "group cursor-pointer font-mono text-stone-900 flex items-center justify-between w-full text-sm/6 whitespace-nowrap p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-dark-950/80 text-stone-950 dark:text-dark-400 aria-[current=page]:bg-white aria-[current=page]:shadow-xs aria-[current=page]:font-semibold aria-[current=page]:text-stone-950 aria-[current=page]:dark:text-dark-200 aria-[current=page]:dark:bg-dark-950/80",
			secondary:
				"inline-flex items-center gap-3 text-base/8 text-gray-600 sm:text-sm/7 dark:text-gray-300 **:data-outline:stroke-gray-400 dark:**:data-outline:stroke-gray-500 **:[svg]:size-5 **:[svg]:sm:size-4 hover:text-gray-950 hover:**:data-highlight:fill-gray-300 hover:**:data-outline:stroke-gray-950 dark:hover:text-white dark:hover:**:data-highlight:fill-gray-600 dark:hover:**:data-outline:stroke-white aria-[current]:font-semibold aria-[current]:text-gray-950 aria-[current]:**:data-highlight:fill-gray-300 aria-[current]:**:data-outline:stroke-gray-950 dark:aria-[current]:text-white dark:aria-[current]:**:data-highlight:fill-gray-600 dark:aria-[current]:**:data-outline:stroke-white",
			tertiary:
				"inline-block border-l border-transparent text-base/8 text-gray-600 hover:border-gray-950/25 hover:text-gray-950 sm:text-sm/6 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white aria-[current]:border-gray-950 aria-[current]:font-semibold aria-[current]:text-gray-950 dark:aria-[current]:border-white dark:aria-[current]:text-white pl-5 sm:pl-4",
			contrast:
				"w-full overflow-hidden whitespace-nowrap text-ellipsis inline-flex items-center gap-x-2 font-medium text-sm/8 text-white rounded-md px-2 py-1 sm:text-sm/7 dark:text-stone-300 **:data-outline:stroke-stone-400 dark:**:data-outline:stroke-stone-500 **:[svg]:size-5 **:[svg]:sm:size-4 hover:bg-[hsl(0_0%_93%_/_8%)] hover:text-white hover:**:data-highlight:fill-stone-300 hover:**:data-outline:stroke-stone-950 dark:hover:text-white dark:hover:**:data-highlight:fill-stone-600 dark:hover:**:data-outline:stroke-white aria-[current]:font-semibold aria-[current]:text-stone-950 aria-[current]:**:data-highlight:fill-stone-300 aria-[current]:**:data-outline:stroke-stone-950 dark:aria-[current]:text-white dark:aria-[current]:**:data-highlight:fill-stone-600 dark:aria-[current]:**:data-outline:stroke-white",
		},
	},
	defaultVariants: {
		variant: "secondary",
	},
});

export type NavigationProps = VariantProps<typeof navigationVariants>;
