import { Request, Response } from "express";
import { orderItems } from "../fakeDatabase";

/**
 * Handles all endpoints related to the Order Item resource
 */
export class OrderItemController {
    /**
     * Get all order items
     * 
     * @param _ Request object (unused)
     * @param res Response object
     */
    public getAll(_: Request, res: Response): void {
        res.json(orderItems);
    }
}
