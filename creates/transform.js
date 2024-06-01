const perform = async (z, bundle) => {
	imagetobeTransformed = "";
	if (bundle.inputData.url.includes("https://cdn.pixelbinz0.de")) {
		imagetobeTransformed = bundle.inputData.url;
	} else {
		const response = await z.request({
			url: `https://api.pixelbinz0.de/service/platform/assets/v1.0/upload/url`,
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				// Add more headers as required
			},
			body: JSON.stringify({
				url: bundle.inputData.url,
				path: "/__zapier_Transfomation",
				tags: bundle.inputData.tags,
				// Assuming filename is static as per your example
				access: "public-read", // Assuming access is static as per your example
				metadata: {}, // Assuming metadata is empty as per your example
				overwrite: true, // Use provided value or default to false
				filenameOverride: true,
			}),
		});
		imagetobeTransformed = response.data.url;
	}

	let i = bundle.inputData.foregroundType || "general";
	let shadow = bundle.inputData.addShadow || false;
	let r = bundle.inputData.refineOutput || true;
	let mt = bundle.inputData.mattingType || "FineMatte";

	imagetobeTransformed = imagetobeTransformed.replace(
		"original",
		`erase.bg(i:${i},shadow:${shadow},r:${r},mt:${mt})`
	);
	// return { url: imagetobeTransformed };

	// start
	testImageUrl = {
		url: imagetobeTransformed,
		method: "GET",
	};

	let retries = 5;

	async function getStatus() {
		retries -= 1;
		const response = await z.request(testImageUrl);

		try {
			statusCode = response.status;

			if (statusCode === 200) {
				return { url: imagetobeTransformed };
			}
			if (statusCode === 202) {
				setTimeout(() => {
					getStatus();
				}, 5000);
			} else throw reponse;
		} catch (error) {
			throw error;
		}
	}

	return getStatus();
	// end
};

module.exports = {
	key: "transform",
	noun: "transform",

	display: {
		label: "Remove Background",
		description:
			"Creates a PixeBin.io URL of the resource with removed background.",
	},

	operation: {
		perform,
		inputFields: [
			{
				key: "url",
				required: true,
				type: "string",
				helpText: "URL of the image to upload.",
			},
			{
				key: "foregroundType",
				label: "Foreground Type",
				type: "string",
				required: false,
				choices: ["general", "ecommerce", "car", "human"],
			},
			{
				key: "addShadow",
				label: "Add Shadow(cars only)",
				required: false,
				type: "boolean",
				helpText:
					"Adds Shadow to objects in result image (currently effective on car images only)",
			},
			{
				key: "refineOutput",
				label: "Refine Output",
				required: false,
				type: "boolean",
			},
			{
				key: "mattingType",
				label: "Matting Type",
				type: "string",
				required: false,
				choices: { GeneralMatte: "General Matte", FineMatte: "Fine Matte" },
			},
		],
	},
};
