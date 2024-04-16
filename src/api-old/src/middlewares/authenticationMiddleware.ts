import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtToken } from "../types/jwt";
import { users } from "../fakeDatabase";

/**
 * Handles token-based authentication. If the token is valid, the user object is added to the request object.
 * If the token is invalid, a 401 error is returned.
 *
 * @param req - Request object
 * @param res - Response object
 *
 * @returns NextFunction | Status 401
 */
export function handleTokenBasedAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
): NextFunction | void {
    const authenticationToken: string | undefined = req.headers["authorization"];

    // Check if there is a token
    if (!authenticationToken) {
        res.status(401).send("Unauthorized");

        return;
    }

    // Check if the token is valid
    let jwtToken: CustomJwtToken | undefined;

    try {
        jwtToken = jwt.verify(
            authenticationToken,
            process.env.JWT_SECRET_KEY
        ) as CustomJwtToken;
    }
    catch {
        // Do nothing
    }

    if (!jwtToken) {
        res.status(401).send("Unauthorized");

        return;
    }

    // Retrieve user from the fake database
    req.user = users.find((e) => e.id === jwtToken!.userId);

    return next();
}
