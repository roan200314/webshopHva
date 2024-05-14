import { ApiProperty } from "@nestjs/swagger";

class ActionReferenceDto {
    @ApiProperty({ description: "Alias of the action" })
    public alias: string;

    @ApiProperty({ description: "Label for the action" })
    public label: string;

    @ApiProperty({ description: "Indicates if action needs an object" })
    public needsObject: boolean;
}

class GameObjectReferenceDto {
    @ApiProperty({ description: "Alias of the game object" })
    public alias: string;

    @ApiProperty({ description: "Name of the game object" })
    public name: string;
}

export class GameStateDto {
    @ApiProperty({ description: "Alias of the room" })
    public roomAlias: string;

    @ApiProperty({ description: "Title of the room" })
    public roomTitle: string;

    @ApiProperty({ description: "Images of the room" })
    public roomImages: string[];

    @ApiProperty({ description: "Text related to the game state" })
    public text: string[];

    @ApiProperty({
        description: "Available actions at current state",
        type: ActionReferenceDto,
        isArray: true,
    })
    public actions: ActionReferenceDto[];

    @ApiProperty({ description: "Objects found in the room", type: GameObjectReferenceDto, isArray: true })
    public objects: GameObjectReferenceDto[];
}

export class PerformActionRequestDto {
    @ApiProperty({ description: "Action to be performed" })
    public action: string;

    @ApiProperty({ description: "Objects involved in the action", required: false })
    public objects?: string[];
}
