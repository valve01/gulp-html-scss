const gulp = require('gulp');
const { series, parallel } = require('gulp');

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


require('./gulp/docs.js');

exports.default = series(
	clearDev,
	parallel(scssDev, htmlIncludeDev, copyImagesDev, copyFontsDev, copyFilesDev, jsDev),
	parallel(startServerDev, watchDev),
);


gulp.task(
	'docs',
	gulp.series(
		'clear:docs',

		gulp.parallel(
			'sass:docs',
			'htmlInclude:docs',
			'copy-images:docs',
			'copy-fonts:docs',
			'copy-files:docs',
			'js:docs',
		),

		gulp.parallel('startServer:docs'),
	),
);
