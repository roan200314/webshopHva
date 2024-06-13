import { Address } from "./Address";
import { CartItem } from "./CartItem";
import { Order } from "./Order";

export enum AuthorizationLevel {
    USER = "user",
    EMPLOYEE = "employee",
    ADMIN = "admin",
}

export type UserData = {
    id: number;
    name: string;
    email: string;

    firstName?: string;
    lastName?: string;
    addresses?: Address[];
    orders?: Order[];
    savedPoints?: number;
    authorizationLevel?: AuthorizationLevel;
    cart?: CartItem[];
};
