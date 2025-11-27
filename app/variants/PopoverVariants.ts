import { cva, type VariantProps } from "class-variance-authority";

export const popoverVariants = cva(
	"backdrop-blur-xl rounded-2xl px-2 shadow-lg focus:outline-none",
	{
		variants: {
			variant: {
				primary: "max-h-80 overflow-y-auto bg-white ring-1 ring-black/5 dark:bg-dark-950",
				secondary: "",
				contrast: "bg-[hsl(0_0%_15%_/_98%)] ring-black/5 dark:bg-dark-950",
			},
			size: {
				fit: "w-fit",
				full: "w-full",
				"3xs": "w-3xs",
				"2xs": "w-2xs",
				xs: "w-xs",
				sm: "w-sm",
				md: "w-md",
				lg: "w-lg",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "fit",
		},
	}
);

export type PopoverProps = VariantProps<typeof popoverVariants>;
