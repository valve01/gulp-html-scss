const gulp = require('gulp');

require('./gulp/dev.js');
require('./gulp/docs.js');
gulp.task(
	'default',
	gulp.series(
		'clear:dev',
		gulp.parallel(
			'sass:dev',
			'htmlInclude:dev',
			'copy-images:dev',
			'copy-fonts:dev',
			'copy-files:dev',
			'js:dev',
		),
		gulp.parallel('startServer:dev', 'watch:dev'),
	),
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
