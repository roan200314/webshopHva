import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

/**
 * `SwaggerExtension` is a class that contains a static function `setupSwagger`
 * which is used to set up Swagger within a passed Nest application
 */
export class SwaggerExtension {
    /**
     * `setupSwagger` is a static method that takes in a Nest Application,
     * sets up a Swagger document and then uses it to set up Swagger within the application
     *
     * @param app - Nest application instance
     */
    public static setupSwagger(app: INestApplication): void {
        // Create a base Swagger schema document configuration with the `DocumentBuilder`
        const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
            .addBearerAuth()
            .setTitle("Webshop API")
            .setDescription("The API behind the webshop application")
            .setVersion("1.0")
            .build();

        // Create a Swagger document object with the specified Swagger configurations
        const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

        // Setup Swagger within the specified Nest Application with `api` as the Swagger URI entrypoint
        SwaggerModule.setup("api", app, document);
    }
}
