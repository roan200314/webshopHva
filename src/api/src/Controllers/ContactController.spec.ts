import { Test, TestingModule } from "@nestjs/testing";
import { ContactController } from "./ContactController";
import { ContactService } from "../Services/ContactService";
import { ContactEmailDto } from "../Models/Dto/ContactEmailDto";

describe("ContactController", () => {
    let contactController: ContactController;
    let contactService: ContactService;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ContactController],
            providers: [{ provide: ContactService, useValue: { sendContactEmail: jest.fn() }}],
        }).compile();

        contactService = moduleRef.get<ContactService>(ContactService);
        contactController = moduleRef.get<ContactController>(ContactController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("send", () => {
        it("should return a success message", async () => {
            const result: { message: string } = { message: "Email sent successfully" };

            const contactEmailDto: ContactEmailDto = new ContactEmailDto();
            contactEmailDto.title = "test";
            contactEmailDto.message = "test";

            jest.spyOn(contactService, "sendContactEmail").mockResolvedValue(result);

            const response: { message: string } = await contactController.sendContactEmail({ user: { id: 1 } }, {} as ContactEmailDto);
            expect(response).toEqual(result);
        });

        it("should throw an error when service fails", async () => {
            const error: Error = new Error("Service failed");

            jest.spyOn(contactService, "sendContactEmail").mockRejectedValueOnce(error);

            try {
                await contactController.sendContactEmail({ user: { id: 1 } }, {} as ContactEmailDto);
            } catch (e) {
                expect(e).toBe(error);
            }
        });
    });
});