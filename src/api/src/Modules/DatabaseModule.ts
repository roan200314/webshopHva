import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../Models/Entities/User";
import { Address } from "../Models/Entities/Address";
import { CartItem } from "../Models/Entities/CartItem";
import { Order } from "../Models/Entities/Order";
import { OrderItem } from "../Models/Entities/OrderItem";

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
                entities: [User, Address, CartItem, Order, OrderItem],
                synchronize: true,
                autoLoadEntities: false,
                logging: false,
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {
}
