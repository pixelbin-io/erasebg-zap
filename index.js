const transform = require("./creates/transform");
const {
	config: authentication,
	befores = [],
	afters = [],
} = require("./authentication");

module.exports = {
	version: require("./package.json").version,
	platformVersion: require("zapier-platform-core").version,

	authentication,

	beforeRequest: [...befores],

	afterResponse: [...afters],

	// If you want your trigger to show up, you better include it here!
	triggers: {},

	// If you want your searches to show up, you better include it here!
	searches: {},

	// If you want your creates to show up, you better include it here!
	creates: {
		[transform.key]: transform,
	},

	resources: {},
};
