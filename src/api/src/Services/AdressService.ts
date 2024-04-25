import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "src/Models/Entities/Address";
import { UpdateAddressDto } from "src/Models/Dto/User/UpdateAddressDto";
import { User } from "src/Models/Entities/User";

@Injectable()
export class AddressService {
    public constructor(
        @InjectRepository(Address)
        private addressItemRepository: Repository<Address>,
    ) {
    }

    public async getAddressForUser(userId: number): Promise<Address> {
        const userAddress: Address[] = await this.addressItemRepository.find({
            where: {
                user: {id: userId}
            }
        });
        
        return userAddress[0];
    }

    public async addAddress(user: User, updateAddressDto: UpdateAddressDto): Promise<Address>{
        const address:Address = new Address();
        address.city = updateAddressDto.city;
        address.country = updateAddressDto.country;
        address.id = updateAddressDto.id;
        address.street = updateAddressDto.street;
        address.zip = updateAddressDto.zip;
        address.user = user;
        
        await this.addressItemRepository.save(address);
        return address;
    }
}
