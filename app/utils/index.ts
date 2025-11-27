import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getChangedFields<T extends Record<string, any>>(
	original: T,
	updated: T
): Partial<T> {
	const changes: Partial<T> = {};

	for (const key in updated) {
		if (updated.hasOwnProperty(key)) {
			if (
				typeof updated[key] === "object" &&
				updated[key] !== null &&
				!Array.isArray(updated[key])
			) {
				const nestedChanges = getChangedFields(
					original[key],
					updated[key]
				);
				if (Object.keys(nestedChanges).length > 0) {
					changes[key] = nestedChanges as T[Extract<keyof T, string>];
				}
			} else if (original[key] !== updated[key]) {
				changes[key] = updated[key];
			}
		}
	}

	return changes;
}


export function calculateCurrent(array: []) {
	// Check if the array is empty
	if (array.length === 0) {
		return 0;
	}

	return array[array.length - 1];
}

export function calculateSum(array: []) {
	// Check if the array is empty
	if (array.length === 0) {
		return 0;
	}

	// Sum all elements in the array
	const sum = array.reduce((acc, current) => acc + current, 0);

	return sum;
}

export function calculateAverage(array: []) {
	// // Check if the array is empty
	// if (array.length === 0) {
	//     return 0;
	// }

	// // Sum all elements in the array
	// const sum = array.reduce((acc, current) => acc + current, 0);
	const sum = calculateSum(array);

	// Calculate the average
	const average = Math.round(sum / array.length);

	return average;
}
