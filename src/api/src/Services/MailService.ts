import { Injectable } from "@nestjs/common";
import { Email } from "../Models/Interfaces/Email";
import * as process from "node:process";

@Injectable()
export class MailService {
    public async sendAccountConfirmationMail(sentEmail: string, sentUsername: string): Promise<void> {
        try {
            await this.sendEmail({
                from: {
                    name: "Webshop",
                    address: "noreply@webshop.com"
                },
                to: [
                    {
                        name: sentUsername,
                        address: sentEmail
                    }
                ],
                subject: "Email Confirmation",
                html: "<h1>Test</p>"
            });
        }
        catch(reason) {
            console.log(reason);
        }
    }

    private async sendEmail(email: Email): Promise<Response> {
        return await fetch(process.env.HIC_API_URL + "/mail", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HIC_API_KEY}`,
            },
            body: JSON.stringify(email),
        });
    }
}