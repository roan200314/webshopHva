import { OrderItem } from "./OrderItem";

export type Order = {
    id: number;
    products: OrderItem[];
    status: string;
};
