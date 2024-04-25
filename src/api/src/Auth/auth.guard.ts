/**
 * A module representing Authentication guard.
 * @module AuthGuard
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./Decorators/public.decorator";

/**
 * AuthGuard class implements CanActivate interface to check if a route is
 * accessible with the current user's authorization details.
 * @class
 */
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * The constructor sets the JwtService and Reflector for this guard.
     * @constructor
     * @param {JwtService} jwtService
     * @param {Reflector} reflector - An instance of the NestJS Reflector utility.
     */
    public constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    /**
     * Determines if user can access certain routes based on the token.
     * @param {ExecutionContext} context - The execution context of the application.
     * @return {boolean} Returns true if user can access the route, false otherwise.
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        // Checks if a route is public and if so returns true as no Authentication is needed
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // eslint-disable-next-line @typescript-eslint/typedef
        const request = context.switchToHttp().getRequest();

        // Extracts token from the header of the request
        const token: string = this.extractTokenFromHeader(request);
        if (!token) {
            // If no token is found, throws an unauthorized exception
            throw new UnauthorizedException();
        }
        try {
            // Verifies the token and assigns the payload to the request object.
            request["user"] = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET_KEY,
            });
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    /**
     * Extracts the token from the header of the request.
     * @param {Request} request - The client request object.
     * @return {string|undefined} Token if available, undefined if not.
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // Splits the authorization header and checks if a token type is `Bearer`.
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
