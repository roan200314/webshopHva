export class RegistrationEmail {
    private readonly userName: string;
    private readonly userEmail: string;

    public constructor(userName: string, userEmail: string) {
        this.userName = userName;
        this.userEmail = userEmail;
    }

    public generate(): string {
        return `
    <div style="font-family: Arial, sans-serif;">
      <h2 style="color: #2a7aea;">Welcome to our webshop!</h2>
      <p>Dear <span style="font-weight: bold;">${this.userName}</span>,</p>
      
      <p>We are pleased to inform you that your account has been successfully created.</p>
      
      <h3>Here are your account details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;"><b>Username:</b></td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${this.userName}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;"><b>Email:</b></td>
            <td style="border: 1px solid #dddddd; padding: 8px; text-align: left;">${this.userEmail}</td>
        </tr>
      </table>
      
      <p>If you did not request this account, please contact our support team immediately.</p>
      
      <p>Thank you for choosing us!</p>
      
      <p>Kind Regards,<br/>Webshop Administration</p>
    </div>
    `;
    }
}