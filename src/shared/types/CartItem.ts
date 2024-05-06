import { OrderItem } from "./OrderItem";

export type CartItem = {
    id: number;
    amount: number;
    item: OrderItem;
};
