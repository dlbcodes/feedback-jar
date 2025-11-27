import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				primary:
					"border-transparent bg-yellow-400 text-stone-900 [a&]:hover:bg-yellow-500/90",
				secondary:
					"border-transparent bg-stone-200 text-stone-900 [a&]:hover:bg-stone-200/90",
				destructive:
					"border-transparent bg-red-500 text-white [a&]:hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60",
				outline:
					"text-stone-900 border-stone-300 [a&]:hover:bg-stone-100 [a&]:text-stone-900",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	}
)

export type BadgeProps = VariantProps<typeof badgeVariants>;
