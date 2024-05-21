import { Injectable } from "@nestjs/common";
import { ApiFailReason, ApiFailResponse, PromiseReject, PromiseResolve } from "../Models/Interfaces/IEmail";
import { Email } from "../Models/Entities/Email";
import { RegistrationEmail } from "../Models/EmailTemplates/RegistrationConfirmation";

@Injectable()
export class MailService {
    public async confirmAccountRegistration(emailAddress: string, name: string): Promise<void> {
        try {
            const email: Email = new Email();
            email.to = [{ address: emailAddress, name: name }];
            email.subject = "Registration Confirmation";
            email.from = { address: "noreply@webshop.com", name: "WebShop" };
            email.html = new RegistrationEmail(name, emailAddress).generate();

            const data: string = await this.sendEmail(email);

            console.log(data);
        } catch (reason) {
            console.log(reason);
        }
    }

    private async sendEmail(email: Email): Promise<string> {
        return this.handleFetch<string>(process.env.HIC_API_URL + "/mail", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HIC_API_KEY}`,
            },
            body: JSON.stringify(email),
        });
    }

    private handleFetch<T = any>(url: string, fetchOptions: RequestInit): Promise<T | ApiFailReason> {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise(async (resolve: PromiseResolve, reject: PromiseReject) => {
            let response: Response;

            try {
                response = await fetch(url, fetchOptions);
            } catch (error) {
                this.apiFail(reject, 500, error);

                return;
            }

            try {
                // eslint-disable-next-line @typescript-eslint/typedef
                const json = await response.json();

                if (response.status === 200) {
                    resolve(json);
                } else {
                    this.apiFail(reject, response.status, (<ApiFailResponse>json).reason);
                }
            } catch (error) {
                this.apiFail(reject, 500, error);
            }
        });
    }

    private apiFail(reject: PromiseReject, statusCode: number, reason?: string | any): void {
        if (statusCode === 400) {
            reject(reason || "Something bad happened, see console.");
        } else {
            reject("Something bad happened, see console.");
        }
    }
}
