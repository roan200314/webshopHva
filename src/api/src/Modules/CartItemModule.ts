import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItemService } from "../Services/CartItemService";

@Module({
    imports: [TypeOrmModule.forFeature([])],
    providers: [CartItemService],
    exports: [CartItemService],
})
export class CartItemModule {}
