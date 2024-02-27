const inputPrompt = require("../models/input-prompt");
const Cohere = require("../config/openai");

module.exports = {
	async sendText(req, res) {
		const inputModel = new inputPrompt(req.body);
		try {
			const response = await Cohere.generateText(inputModel);
			// Assuming response contains the generated texts
			return res.status(200).json({
				success: true,
				data: response,
			});
		} catch (error) {
			console.error("Error occurred while processing the request:", error);
			return res.status(500).json({
				success: false,
				error: "Internal server error",
			});
		}
	},
};
