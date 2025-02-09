import { UserData } from "./UserData";

export type Address = {
    id: number;
    street: string;
    city: string;
    zip: string;
    country: string;
    user: UserData;
};
