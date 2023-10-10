const { series, parallel } = require('gulp');

// ==============================================================DEV==================================================
const {
	clearDev,
	scssDev,
	htmlIncludeDev,
	copyImagesDev,
	copyFontsDev,
	copyFilesDev,
	jsDev,
	startServerDev,
	watchDev,
} = require('./gulp/dev.js');

exports.default = series(
	clearDev,
	parallel(scssDev, htmlIncludeDev, copyImagesDev, copyFontsDev, copyFilesDev, jsDev),
	parallel(startServerDev, watchDev),
);

// =============================================================DOCS===============================================
const {
	clearDocs,
	htmlIncludeDocs,
	scssDocs,
	copyImagesDocs,
	copyFontsDocs,
	copyFilesDocs,
	jsDocs,
	startServerDocs,
} = require('./gulp/docs.js');

exports.docs = series(
	clearDocs,
	parallel(htmlIncludeDocs, scssDocs, copyImagesDocs, copyFontsDocs, copyFilesDocs, jsDocs),
	parallel(startServerDocs),
);

