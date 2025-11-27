import { H3Event, createError } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { serverSupabaseClient } from "#supabase/server";


/**
 * Authenticate the user via Supabase
 * @param event H3Event
 * @returns Authenticated user object
 * @throws Error if authentication fails
 */
export const requireAuthUser = async (event: H3Event) => {
	const supabase = await serverSupabaseClient(event); // <- await here

	const { data: { user }, error } = await supabase.auth.getUser();

	if (error || !user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized. Please log in.",
		});
	}

	return {
		id: user.id,
		email: user.email,
		role: user.role,
		email_confirmed_at: user.email_confirmed_at,
		last_sign_in_at: user.last_sign_in_at,
		app_metadata: user.app_metadata,
		user_metadata: user.user_metadata,
	};
};



export const getOptionalUser = async (event: H3Event) => {
	try {
		const user = await serverSupabaseUser(event);
		return user ?? null;
	} catch {
		return null;
	}
};