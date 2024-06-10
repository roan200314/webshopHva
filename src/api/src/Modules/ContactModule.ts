import { Module } from "@nestjs/common";
import { ContactService } from "../Services/ContactService";
import { ContactController } from "../Controllers/ContactController";
import { MailModule } from "./MailModule";
import { UserModule } from "./UserModule";

@Module({
    imports: [MailModule, UserModule],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule {}