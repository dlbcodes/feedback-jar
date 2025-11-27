import {
	type loginSchemaType,
	type registerSchemaType,
	type resetSchemaType,
	type recoverSchemaType,
} from "~/types/auth";
import { type User } from "@supabase/supabase-js";

export const useAuth = () => {
	const runtimeConfig = useRuntimeConfig()
	const supabase = useSupabaseClient();
	const profileStore = useProfileStore(); // Single store for everything
	const user = ref<User | null>(null);
	const error = ref<string | string[] | null>(null);
	const loading = ref(false);
	const baseUrl = runtimeConfig.public.BASE_URL

	/**
	 * Login User
	 */
	const login = async (params: loginSchemaType) => {
		loading.value = true;

		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email: params.email,
				password: params.password,
			});

			if (authError) {
				error.value = authError.message;
				return false;
			}

			// Set user first
			user.value = data.user;
			profileStore.setUser(data.user);

			// Then fetch profile
			await profileStore.fetchProfile();

			error.value = null;
			return true;
		} catch (err) {
			error.value = "Login failed";
			return false;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Register new user
	 */
	const register = async (params: registerSchemaType) => {
		loading.value = true;

		try {
			const { data, error: authError } = await supabase.auth.signUp({
				email: params.email,
				password: params.password,
				options: {
					data: {
						name: params.name,
						avatar: null,
					},
				},
			});

			if (authError) {
				error.value = authError.message;
				return false;
			}

			user.value = data.user;
			error.value = null;
			return true;
		} catch (err) {
			error.value = "Registration failed";
			return false;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Request password reset by email
	 */
	const forgot = async (params: resetSchemaType) => {
		loading.value = true;

		try {
			const { error: authError } = await supabase.auth.resetPasswordForEmail(params.email, {
				redirectTo: `${baseUrl}/recover`,
			});

			if (authError) {
				error.value = authError.message;
				return false;
			}

			error.value = null;
			return true;
		} catch (err) {
			error.value = "Password reset failed";
			return false;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Reset user password
	 */
	const recover = async (params: recoverSchemaType) => {
		loading.value = true;

		try {
			const { error: authError } = await supabase.auth.updateUser(params);

			if (authError) {
				error.value = authError.message;
				return false;
			}

			error.value = null;

			return true;
		} catch (err) {
			error.value = "Password recovery failed";
			return false;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Update auth user (for auth-level changes like email/password)
	 */
	const update = async (params: any) => {
		loading.value = true;

		try {
			const { data, error: authError } = await supabase.auth.updateUser(params);

			if (authError) {
				error.value = authError.message;
				return false;
			}

			profileStore.setUser(data.user);

			error.value = null;
			return true;
		} catch (err) {
			error.value = "User update failed";
			return false;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Logout user
	 */
	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Sign out error:", error);
				return false;
			}

			// Clear store on successful logout
			profileStore.clearAll();

			return true;
		} catch (err) {
			console.error("Sign out failed:", err);
			return false;
		}
	};

	return {
		user,
		error,
		loading,
		login,
		register,
		forgot,
		recover,
		update,
		signOut,
	};
};