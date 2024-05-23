import { OrderItem } from "./OrderItem";

export type Order = {
    id: number;
    products: OrderItem[];
    status: string;
    street: string;
    city: string;
    zip: string;
    country: string;
};
