const { StreamingTextResponse, CohereStream } = require("ai");

module.exports = class Cohere {
	static async generateText({ prompt }) {
		const body = JSON.stringify({
			prompt,
			model: "command-nightly",
			max_tokens: 300,
			stop_sequences: [],
			temperature: 0.9,
			return_likelihoods: "NONE",
			stream: true,
		});
		const response = await fetch("https://api.cohere.ai/v2/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
			},
			body,
		});

		if (!response.ok) {
			console.error("Error:", await response.text());
			return new Response(await response.text(), { status: response.status });
		}

		let responseBody = await response.text();
		const chunks = responseBody.split("\n");

		let finalText = "";
		for (const chunk of chunks) {
			if (chunk) {
				const data = JSON.parse(chunk);
				if (data.is_finished && data.event_type === "stream-end") {
					finalText = data.response.generations[0].text;
					break;
				}
			}
		}
		return finalText;
	}
};
