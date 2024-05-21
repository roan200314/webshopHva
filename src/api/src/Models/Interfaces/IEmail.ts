/**
 * Shared types for the HBO-ICT.Cloud library
 *
 * @module
 */

/** Type definition to make a clear distinction between successful and failed responses in the documentation */
export type ApiFailReason = string;

/** Type definition of function used to resolve a promise */
export type PromiseResolve = ((value: any) => void) & NonNullable<unknown>;

/** Type definition of function used to reject a promise */
export type PromiseReject = ((reason?: string) => void) & NonNullable<unknown>;

/** Represents a failed response from the API */
export interface ApiFailResponse {
    /** Reason why the response failed */
    reason: string;
}

/**
 * Represents a single email contact
 */
export interface EmailAddress {
    /** Name of the contact */
    name?: string;
    /** IEmail address of the contact */
    address: string;
}

/**
 * Represents an email. Is only considered valid when all required fields are provided and either {@link text} or {@link html} have a value.
 */
export interface IEmail {
    /** Sender of the email */
    from: EmailAddress;
    /** Receivers of the email */
    to: EmailAddress[] | string;
    /** Other receivers of the email */
    cc?: EmailAddress[] | string;
    /** Blind receivers of the email */
    bcc?: EmailAddress[] | string;
    /** Subject of the email */
    subject: string;
    /** Contents of the email as text */
    text?: string;
    /** Contents of the email as html */
    html?: string;
}
