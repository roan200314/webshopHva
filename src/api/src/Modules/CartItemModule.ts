import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItemService } from "../Services/CartItemService";
import { CartItem } from "../Models/Entities/CartItem";

@Module({
    imports: [TypeOrmModule.forFeature([CartItem])],
    providers: [CartItemService],
    exports: [CartItemService],
})
export class CartItemModule {}
