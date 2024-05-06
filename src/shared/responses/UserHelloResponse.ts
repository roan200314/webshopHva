import { CartItem, UserData } from "@shared/types";

export type UserHelloResponse = {
    user: UserData;
    cartItems: CartItem[] | undefined;
    email: string;
};
