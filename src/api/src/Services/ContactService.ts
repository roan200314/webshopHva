import { Injectable } from "@nestjs/common";
import { MailService } from "./MailService";
import { ContactEmailDto } from "../Models/Dto/ContactEmailDto";
import { UserService } from "./UserService";
import { User } from "../Models/Entities/User";

@Injectable()
export class ContactService {
    public constructor(
        private userService: UserService,
        private mailService: MailService,
    ) {}

    public async sendContactEmail(userId: number, contactEmailDto: ContactEmailDto): Promise<void> {
        const user: User = await this.userService.getUserById(userId);

        await this.mailService.sendContactEmail(user.name, user.email, contactEmailDto);
    }
}