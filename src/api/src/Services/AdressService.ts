import { Injectable, NotFoundException } from "@nestjs/common";
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
    ) {}

    public async getAddressForUser(userId: number): Promise<Address> {
        const userAddress: Address = await this.addressItemRepository.findOne({
            where: {
                user: { id: userId },
            },
        });

        if (!userAddress) {
            throw new NotFoundException("No address found for this user");
        }

        return userAddress;
    }

    public async addAddress(user: User, updateAddressDto: UpdateAddressDto): Promise<Address> {
        const address: Address = Object.assign(new Address(), updateAddressDto, { user });
        await this.addressItemRepository.save(address);
        return address;
    }
}
