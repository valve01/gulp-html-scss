const { series, parallel } = require('gulp');

// ==============================================================DEV==================================================
const {
	cleanDev,
	scssDev,
	htmlIncludeDev,
	copyImagesDev,
	fontsDev,
	copyFilesDev,
	jsDev,
	startServerDev,
	watchDev,
	spriteDev,
} = require('./gulp/dev.js');

exports.default = series(
	cleanDev,
	parallel(scssDev, htmlIncludeDev, copyImagesDev, spriteDev, fontsDev, copyFilesDev, jsDev),
	parallel(startServerDev, watchDev),
);

// =============================================================PROD===============================================
const {
	cleanDocs,
	htmlIncludeDocs,
	scssDocs,
	imagesDocs,
	fontsDocs,
	copyFilesDocs,
	jsDocs,
	// startServerDocs,
	spriteDocs,
	deployGhP,
	cleanPublish,
} = require('./gulp/docs.js');

exports.docs = series(
	parallel(cleanDocs, cleanPublish),
	parallel(htmlIncludeDocs, scssDocs, imagesDocs, spriteDocs, fontsDocs, copyFilesDocs, jsDocs),
	// parallel(startServerDocs),
);
exports.deployGhP = deployGhP;
