import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Address } from "@shared/types";
import { UpdateAddressDto } from "src/Models/Dto/User/UpdateAddressDto";
import { AddressService } from "src/Services/AdressService";

@ApiTags("Address")
@Controller("address")
export class AdressController {
    public constructor(private addressService: AddressService) {}

    @ApiOperation({ summary: "Get an address for logged in user" })
    @ApiResponse({ status: 200, description: "Successful retrieval of address" })
    @ApiBearerAuth()
    @Get("get")
    public async getAddress(@Request() req): Promise<Address> {
        return await this.addressService.getAddressForUser(req.user.id);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Set an address for logged in user" })
    @ApiResponse({ status: 200, description: "Successful creating / updating of address" })
    @ApiConsumes("application/json")
    @ApiBearerAuth()
    @ApiBody({ type: UpdateAddressDto })
    @Post("set")
    public async setAddress(@Request() req, @Body() addressDto: UpdateAddressDto): Promise<Address> {
        return await this.addressService.addAddress(req.user, addressDto);
    }
}
