import { cva, type VariantProps } from "class-variance-authority";

export const avatarVariants = cva(
	"flex flex-col w-full justify-center bg-stone-100 border border-stone-200 uppercase text-stone-950 dark:text-dark-400 dark:bg-dark-900 dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)] *:overflow-hidden *:bg-white *:shadow-xs *:rounded-2xl *:dark:bg-dark-950 *:dark:border *:dark:border-black *:dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)]",
	{
		variants: {
			size: {
				"6xl": "text-3xl size-24 p-1 rounded-3xl *:rounded-[20px]",
				"5xl": "text-3xl size-22  p-1 rounded-3xl *:rounded-[20px]",
				"4xl": "text-4xl size-20 p-1 rounded-3xl *:rounded-[20px]",
				"3xl": "text-xl size-18 p-1 rounded-2xl *:rounded-xl",
				"2xl": "size-16",
				xl: "size-14 rounded-xl *:rounded-[10px]",
				lg: "size-12 p-0.5 rounded-xl *:rounded-[10px]",
				base: "size-10 rounded-xl *:rounded-[10px]",
				sm: "size-8 rounded-xl *:rounded-[10px]",
				xs: "size-6 rounded-md *:rounded-[6px]",
			},
		},
		defaultVariants: {
			size: "base",
		},
	}
);

export type AvatarProps = VariantProps<typeof avatarVariants>;