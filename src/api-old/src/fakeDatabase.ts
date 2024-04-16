/**
 * This file represents a database with two tables: User and OrderItem.
 * 
 * It should be noted that this fake database does not directly translate to an actual relational database.
 */
import { OrderItem, UserData } from "@shared/types";

/**
 * User table
 */
export const users: UserData[] = [
    {
        id: 1,
        email: "test@test.nl",
        name: "test",
        password: "$2b$10$GCObbpQrqu1kuaKex6aW8e4SnmC6w8ykffdvLStHNCFq8QECGMzBW", // test
    },
];

/**
 * Order item table
 */
export const orderItems: OrderItem[] = [
    {
        id: 1,
        name: "Item 1",
        description: "Description 1",
        price: 10,
        imageURLs: ["https://via.placeholder.com/150"],
    },
    {
        id: 2,
        name: "Item 2",
        description: "Description 2",
        price: 20,
        imageURLs: ["https://via.placeholder.com/150"],
    },
    {
        id: 3,
        name: "Item 3",
        description: "Description 3",
        price: 30,
        imageURLs: ["https://via.placeholder.com/150"],
    },
];
