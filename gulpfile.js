const { series, parallel } = require('gulp');

// ==============================================================DEV==================================================
const {
	cleanDev,
	scssDev,
	htmlIncludeDev,
	copyImagesDev,
	copyFontsDev,
	copyFilesDev,
	jsDev,
	startServerDev,
	watchDev,
	spriteDev,
} = require('./gulp/dev.js');

exports.default = series(
	cleanDev,
	parallel(scssDev, htmlIncludeDev, copyImagesDev, spriteDev, copyFontsDev, copyFilesDev, jsDev),
	parallel(startServerDev, watchDev),
);

// =============================================================DOCS===============================================
const {
	cleanDocs,
	htmlIncludeDocs,
	scssDocs,
	imagesDocs,
	copyFontsDocs,
	copyFilesDocs,
	jsDocs,
	startServerDocs,
	spriteDocs,
} = require('./gulp/docs.js');

exports.docs = series(
	cleanDocs,
	parallel(htmlIncludeDocs, scssDocs, imagesDocs, spriteDocs, copyFontsDocs, copyFilesDocs, jsDocs),
	parallel(startServerDocs),
);
