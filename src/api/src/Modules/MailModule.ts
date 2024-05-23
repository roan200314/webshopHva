import { Module } from "@nestjs/common";
import { MailService } from "../Services/MailService";

@Module({
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
