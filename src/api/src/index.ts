import { NestFactory } from "@nestjs/core";
import { AppModule } from "./Modules/AppModule";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NetworkConstants } from "./Constants/NetworkConstants";
import { CorsExtension } from "./Extensions/CorsExtension";
import { SwaggerExtension } from "./Extensions/SwaggerExtension";
import { config } from "dotenv";

config();
config({ path: ".env.production", override: true });
config({ path: ".env.local", override: true });

/**
 * Entry point for the application.
 *
 * In this function, we set up essential middlewares such as
 * - CORS (with CorsExtension)
 * - Swagger (with SwaggerExtension)
 * - Global ValidationPipe for ensuring input validation across the app
 *
 * Lastly, the app gets booted up on the given port or the default port if not provided.
 */
async function bootstrap(): Promise<void> {
    const app: INestApplication = await NestFactory.create(AppModule);

    // Set up CORS
    CorsExtension.setupCors(app);

    // Set up Swagger
    SwaggerExtension.setupSwagger(app);

    // Set up global Pipes for data validation
    app.useGlobalPipes(new ValidationPipe());

    // Boot up the NestJS application on the provided port or the default port if not provided.
    await app.listen(process.env.PORT || NetworkConstants.DEFAULT_PORT);
}

// Execute the bootstrap function to start the application.
// Log a simple message or an error message based on the result of the promise.
bootstrap()
    .then(() => console.log("Application started"))
    .catch((err) => console.error("Error running the application", err));
