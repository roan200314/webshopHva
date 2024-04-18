import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY: string = "isPublic";

/**
 * Type for the Public decorator function.
 */
export type PublicDecorator = () => ReturnType<typeof SetMetadata>;

/**
 * A decorator function to denote a route as public.
 * It will be used in the application to by-pass certain middlewares, guards, etc. for public routes
 * This decorator sets metadata 'isPublic' to true for the decorated route handler
 * @return {Function} - The SetMetadata decorator function configured with 'isPublic' set to true
 */
export const Public: PublicDecorator = () => SetMetadata(IS_PUBLIC_KEY, true);
