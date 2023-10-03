const gulp = require ("gulp")

require("./gulp/dev.js")

gulp.task(
	'default',
	gulp.series(
		'clear:dev',
		gulp.parallel('sass:dev', 'htmlInclude:dev', 'copy-images:dev', 'copy-fonts:dev', 'copy-files:dev', 'js:dev'),
		gulp.parallel('startServer:dev', 'watch:dev'),
	),
);