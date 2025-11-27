import { z, type ZodType, ZodError } from "zod";
import { ref, type Ref } from "vue";

interface ValidationErrors {
	[key: string]: string;
}

export default function useValidation<T>(schema: ZodType<T>) {
	const errors: Ref<ValidationErrors> = ref({});

	const validate = (data: T): boolean => {
		try {
			schema.parse(data);
			errors.value = {};
			return true;
		} catch (err) {
			if (err instanceof ZodError) {
				const formattedErrors: ValidationErrors = {};
				// Zod v4 uses 'issues' instead of 'errors'
				err.issues.forEach((issue) => {
					const key = issue.path?.[0]?.toString() || "form";
					formattedErrors[key] = issue.message;
				});
				errors.value = formattedErrors;
			}
			return false;
		}
	};

	const resetErrors = () => {
		errors.value = {};
	};

	return {
		errors,
		validate,
		resetErrors,
	};
}
