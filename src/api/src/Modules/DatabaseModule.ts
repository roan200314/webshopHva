import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserData } from "../Models/Entities/UserData";
import { Address } from "../Models/Entities/Address";
import { Category } from "../Models/Entities/Category";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";
import { Product } from "../Models/Entities/Product";
import { Service } from "../Models/Entities/Service";
import { ShoppingCart } from "../Models/Entities/ShoppingCart";
import { ShoppingCartItem } from "../Models/Entities/ShoppingCartItem";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                type: "mysql",
                host: process.env.DATABASE_HOST,
                port: Number(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [UserData, Address, Category, Order, OrderItem, Product, Service, ShoppingCart, ShoppingCartItem],
                synchronize: false,
                autoLoadEntities: false,
                logging: false,
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {
}
