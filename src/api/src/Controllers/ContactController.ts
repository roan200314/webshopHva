import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { ContactService } from "../Services/ContactService";
import { ContactEmailDto } from "../Models/Dto/ContactEmailDto";

@ApiTags("Contact")
@Controller("contact")
export class ContactController {
    public constructor(private contactService: ContactService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Set an address for logged in user" })
    @ApiResponse({ status: 200, description: "Successful creating / updating of address" })
    @ApiConsumes("application/json")
    @ApiBearerAuth()
    @ApiBody({ type: ContactEmailDto })
    @Post("send")
    public async sendContactEmail(
        @Request() req,
        @Body() contactEmail: ContactEmailDto,
    ): Promise<{ message: string }> {
        return await this.contactService.sendContactEmail(req.user.id, contactEmail);
    }
}
