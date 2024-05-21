/**
 * Represents a single email contact
 */
export interface EmailAddress {
    /** Name of the contact */
    name?: string;
    /** Email address of the contact */
    address: string;
}

/**
 * Represents an email. Is only considered valid when all required fields are provided and either {@link text} or {@link html} have a value.
 */
export interface Email {
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