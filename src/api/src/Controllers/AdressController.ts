import { Controller, Get, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Address } from "@shared/types";
import { AddressService } from "src/Services/AdressService";

@ApiTags("Address")
@Controller("address")
export class AdressController {

    public constructor(private addressService: AddressService) {
    }

    @ApiOperation({summary: "Get an address for logged in user"})
    @ApiResponse({status: 200, description: "Successful retrieval of address"})
    @ApiBearerAuth()
    @Get("get")
    public async getAddress(@Request() req): Promise<Address> {
        return await this.addressService.getAddressForUser(req.user.id);
    }
}