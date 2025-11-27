// variants/ButtonGroupVariants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const selectorGroupVariants = cva(
	"flex items-center bg-stone-100 rounded-2xl p-1 w-fit gap-x-1",
	{
		variants: {
			orientation: {
				horizontal: "flex-row",
				vertical: "flex-col",
			},
		},
		defaultVariants: {
			orientation: "horizontal",
		},
	}
);

export const selectorVariants = cva(
	"flex items-center gap-x-1 text-sm px-3 py-2 rounded-xl transition-colors outline-none",
	{
		variants: {
			selected: {
				true: "bg-white shadow-xs font-medium text-stone-900",
				false: "text-stone-600 hover:bg-stone-200",
			},
		},
	}
);

export type SelectorGroupVariantsProps = VariantProps<typeof selectorGroupVariants>;
export type SelectorVariantsVariantsProps = VariantProps<typeof selectorVariants>;
