import { SetMetadata } from "@nestjs/common";

export const IS_ADMIN_KEY: string = "IsAdmin";

export type AdminOnlyDecorator = () => ReturnType<typeof SetMetadata>;

export const AdminOnly: AdminOnlyDecorator = () => SetMetadata(IS_ADMIN_KEY, true);
