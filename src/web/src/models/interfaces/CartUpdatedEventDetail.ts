import { CartItem } from "@shared/types";

export interface CartUpdatedEventDetail {
    cartItems: CartItem[];
}