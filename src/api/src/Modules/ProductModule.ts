import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "src/Services/ProductsService";

@Module({
    imports: [TypeOrmModule],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
