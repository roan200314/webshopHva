import { CartItem } from "@shared/types";

export type UserHelloResponse = {
    email: string;
    cartItems: CartItem[] | undefined;
};
