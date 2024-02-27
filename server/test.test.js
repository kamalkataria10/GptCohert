const { sendText } = require("./src/controllers/prompt-controller");

const inputPrompt = require("./src/models/input-prompt");
const Cohere = require("./src/config/openai");

const mockRequestBody = {};

describe("sendText", () => {
	let res;

	beforeEach(() => {
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	test("should send generated text on successful response from Cohere", async () => {
		const inputModel = new inputPrompt(mockRequestBody);
		const mockResponse = "Generated text";
		jest.spyOn(Cohere, "generateText").mockResolvedValueOnce(mockResponse);

		await sendText({ body: mockRequestBody }, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			success: true,
			data: mockResponse,
		});
	});

	test("should handle error and return internal server error", async () => {
		const inputModel = new inputPrompt(mockRequestBody);
		const mockError = new Error("Test error");
		jest.spyOn(Cohere, "generateText").mockRejectedValueOnce(mockError);

		await sendText({ body: mockRequestBody }, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			error: "Internal server error",
		});
	});
});
