const gulp = require('gulp');

// gulp.task('hello', function (done) {
// 	console.log('hello gulp');
// 	done()
// });

// gulp.task('fuck', function (done) {
// 	console.log('fuck you gulp');
// 	done()
// });

// gulp.task('default', gulp.series('hello', 'fuck'));

// =========================================================================================================================
const fileInclude = require('gulp-file-include');

const fileincludeSettings = { prefix: '@@', basepath: '@file' };

gulp.task('fileinclude', function () {
	return gulp.src('./src/*.html').pipe(fileInclude(fileincludeSettings)).pipe(gulp.dest('./dist/'));
});
// =========================================================================================================================
const scss = require('gulp-sass')(require('sass'));

gulp.task('sass', function () { 
	return gulp.src('./src/scss/*.scss').pipe(scss()).pipe(gulp.dest('./dist/css'));

});
// =========================================================================================================================

gulp.task('copy-files', function () {

	return gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img'));

});
// =========================================================================================================================

const server = require('gulp-server-livereload');

gulp.task('startServer', function () {
	return gulp.src('./dist/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
});
// =========================================================================================================================