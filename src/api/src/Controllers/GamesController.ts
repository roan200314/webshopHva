import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Delete, Param, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { GamesService } from "../Services/GamesService";
import { Games } from "../Models/Entities/Games";
import { Public } from "../Auth/Decorators/public.decorator";

@ApiTags("Games")
@Controller("games")
export class GamesController {
    public constructor(private gamesService: GamesService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Gets all available games" })
    @ApiResponse({ status: 200, description: "Successful retrieval of the games" })
    @Public()
    @Get("getAll")
    public async getGames(): Promise<Games[]> {
        return await this.gamesService.getAllGames();
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Games Importer" })
    @ApiResponse({ status: 200, description: "Successful import of the games" })
    @Public()
    @ApiBody({ type: Games, isArray: true })
    @Post("massImport")
    public async massImport(@Body() games: Games[]): Promise<void> {
        await this.gamesService.massImport(games);
    }

    // deletes user
    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    @Public()
    @ApiOperation({ summary: "Deletes the game based on id" })
    @ApiResponse({ status: 200, description: "Game deleted" })
    public async deleteGame(@Param("id") id: number): Promise<{ message: string }> {
        return await this.gamesService.deleteGame(id);
    }

    @Public()
    @Get("search/:name")
    @ApiOperation({ summary: "Searches for an game item by its name" })
    @ApiResponse({ status: 200, description: "Game Item" })
    public async searchOrderItemByName(@Param("name") name: string): Promise<Games[]> {
        
        return await this.gamesService.searchGameItemByName(name);
    }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Get("/:id")
    @ApiOperation({ summary: "Retrieves the game based on id" })
    @ApiResponse({ status: 200, description: "Game fetched" })
    public async fetchGame(@Param("id") id: number): Promise<Games> {
        return await this.gamesService.getGameItemById(id);
    }
}
