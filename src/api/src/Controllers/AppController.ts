import { Controller, Get } from "@nestjs/common";
import { AppService } from "../Services/AppService";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../Auth/Decorators/public.decorator";

@ApiTags("Hello World")
@Controller()
export class AppController {
    public constructor(private readonly appService: AppService) {}

    @Public()
    @Get()
    public getHello(): string {
        return this.appService.getHello();
    }
}
