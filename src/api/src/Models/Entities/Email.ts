import { EmailAddress, IEmail } from "../Interfaces/IEmail";
import { IsEmail, IsNotEmpty } from "class-validator";

export class Email implements IEmail {
    @IsEmail()
    public from: EmailAddress;

    @IsEmail()
    public to: EmailAddress[] | string;

    @IsEmail()
    public cc?: EmailAddress[] | string;

    @IsEmail()
    public bcc?: EmailAddress[] | string;

    @IsNotEmpty()
    public subject: string;

    public text?: string;
    public html?: string;
}
