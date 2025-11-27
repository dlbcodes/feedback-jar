import type { SendEmailDto, EmailResponse } from "~/types/email";
import { sendEmailSchema } from "~/types/email";

export class EmailApiError extends Error {
	public readonly statusCode?: number;
	public readonly originalError?: any;

	constructor(message: string, statusCode?: number, originalError?: any) {
		super(message);
		this.name = "EmailApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
}

export class EmailApiService {
	private readonly baseUrl: string;

	constructor(baseUrl: string = "/api/v1/email") {
		this.baseUrl = baseUrl;
	}

	/**
	 * Send an email via Resend
	 */
	async send(emailData: SendEmailDto): Promise<EmailResponse> {
		// Client-side validation
		const validation = sendEmailSchema.safeParse(emailData);

		if (!validation.success) {
			throw new EmailApiError(
				"Invalid email data",
				400,
				validation.error.format()
			);
		}

		try {
			const response = await $fetch<EmailResponse>(`${this.baseUrl}/send`, {
				method: "POST",
				body: validation.data,
			});

			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to send email");
		}
	}

	/**
	 * Send a simple text email
	 */
	async sendText(to: string | string[], subject: string, text: string): Promise<EmailResponse> {
		return this.send({ to, subject, text });
	}

	/**
	 * Send an HTML email
	 */
	async sendHtml(to: string | string[], subject: string, template: string, variables?: Record<string, any>): Promise<EmailResponse> {
		return this.send({ to, subject, template, variables });
	}

	/**
	 * Private error handler
	 */
	private _handleError(error: any, fallbackMessage: string): EmailApiError {
		const message = error?.data?.message || error?.message || fallbackMessage;
		const statusCode = error?.status || error?.statusCode;

		console.error("EmailApiService Error:", {
			message,
			statusCode,
			originalError: error,
		});

		return new EmailApiError(message, statusCode, error);
	}
}

// Singleton instance
export const emailApiService = new EmailApiService();