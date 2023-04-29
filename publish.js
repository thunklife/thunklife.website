const ghPages = require('gh-pages');

ghPages.publish('./_site', (err) => {
	throw err;
});