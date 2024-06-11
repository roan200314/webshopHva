export class Contact {
    private readonly name: string;
    private readonly email: string;
    private readonly message: string;

    public constructor(name: string, email: string, message: string) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public generate(): string {
        return `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px;">
                <div style="background: #ffffff; border-radius: 8px; padding: 20px;">
                    <h1 style="color: #2a7aea;">Webshop Contact Form</h1>
                    <div style="text-align: left; margin-top: 20px;">
                        <p><strong>Name:</strong> ${this.name}</p>
                        <p><strong>Email:</strong> ${this.email}</p>
                        <p><strong>Message:</strong></p>
                        <p>${this.message}</p>
                    </div>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;"/>
                    <p style="font-size: 0.8em; color: #888;">Thank you for contacting us!<br/>The Webshop Team</p>
                </div>
            </div>`;
    }
}
