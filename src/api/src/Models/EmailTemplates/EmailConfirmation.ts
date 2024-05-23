export class EmailConfirmation {
    private readonly userName: string;
    private readonly confirmationUrl: string;

    public constructor(userName: string, token: string) {
        this.userName = userName;
        this.confirmationUrl = `${process.env.WEBSITE_URL}emailconfirmation.html?token=${token}`;
    }

    public generate(): string {
        return `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; text-align: center;">
            <div style="background: #fff; border-radius: 8px; padding: 20px;">
                <h1 style="color: #2a7aea;">Welcome, ${this.userName}!</h1>
                <p>We are excited that you have joined our webshop! There's just one last step for you to complete.</p>
                <p>We need you to confirm your email address by clicking the button below.</p>
                <div style="margin: 20px 0;">
                    <a href="${this.confirmationUrl}" 
                       style='display: inline-block; font-weight: bold; color: white; background-color: #2a7aea; text-decoration: none; padding: 15px 30px; border-radius: 4px;'>
                       Confirm Email
                    </a>
                </div>
                <p>If you received this email by mistake, simply delete it. You won't be subscribed if you don't click the confirmation button above.</p>
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;"/>
                <p style="font-size: 0.8em; color: #888;">Thank you for registering on our webshop!<br/>The Webshop Administration Team</p>
            </div>
        </div>`;
    }
}
