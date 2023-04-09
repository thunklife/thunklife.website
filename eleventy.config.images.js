const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = eleventyConfig => {
	// Only one module.exports per configuration file, please!
module.exports = function(eleventyConfig) {

	// WebC
	eleventyConfig.addPlugin(eleventyWebcPlugin, {
		components: [
			// …
			// Add as a global WebC component
			"npm:@11ty/eleventy-img/*.webc",
		]
	});

	// Image plugin
	eleventyConfig.addPlugin(eleventyImagePlugin, {
		// Set global default options
		formats: ["webp", "jpeg"],
		urlPath: "/static/img/",
		widths: [600, 300, 150],
		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		}
	});
};
};