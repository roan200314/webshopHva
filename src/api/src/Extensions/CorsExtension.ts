import { INestApplication } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

/**
 * CorsExtension - A Class used to configure CORS (Cross-Origin Resource Sharing).
 * @class CorsExtension
 */
export class CorsExtension {
    /**
     * Setup CORS (NEEDS TO BE ADJUSTED ONCE MOVED TO PROD - Bram).
     * @static
     * @method setupCors
     * @param {INestApplication} app - The application to set up CORS.
     */
    public static setupCors(app: INestApplication): void {
        // CORS configurations.
        const corsOptions: CorsOptions = {
            // Allowing all domains (for development purpose).
            origin: "*",

            // Allowed request resource operation methods.
            methods: ["GET", "POST", "PUT", "DELETE"],

            // Headers that are allowed to be accessed by the client.
            allowedHeaders: ["Content-Type", "Authorization"],
        };

        // Enabling CORS with the specified options.
        app.enableCors(corsOptions);
    }
}
