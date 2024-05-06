import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdressController } from "src/Controllers/AdressController";
import { Address } from "src/Models/Entities/Address";
import { AddressService } from "src/Services/AdressService";

@Module({
    imports: [TypeOrmModule.forFeature([Address])],
    providers: [AddressService],
    controllers: [AdressController],
    exports: [AddressService]
})
export class AddressModule {}