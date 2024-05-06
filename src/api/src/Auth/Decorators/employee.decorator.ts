import { SetMetadata } from "@nestjs/common";

export const IS_EMPLOYEE_KEY: string = "IsEmployee";

export type EmployeeOnlyDecorator = () => ReturnType<typeof SetMetadata>;

export const EmployeeOnly: EmployeeOnlyDecorator = () => SetMetadata(IS_EMPLOYEE_KEY, true);
