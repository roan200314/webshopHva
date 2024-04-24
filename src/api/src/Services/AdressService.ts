import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "src/Models/Entities/Address";

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
}
