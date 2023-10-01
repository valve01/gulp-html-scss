const gulp = require('gulp');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

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

const plumberConfig = (title) => {
	return {
		errorHandler: notify.onError({
			title, // место откуда пришла ошибка
			message: 'Error <%= error.message %>', // шаблон из документации notify
			sound: false,
		}),
	};
};

// =========================================================================================================================
const fileInclude = require('gulp-file-include');

const fileincludeSettings = { prefix: '@@', basepath: '@file' };

// const plumberHtmlConfig = {
// 	errorHandler: notify.onError({
// 		title: 'Html', // место откуда пришла ошибка
// 		message: 'Error <%= error.message %>', // шаблон из документации notify
// 		sound: false,
// 	}),
// };

gulp.task('fileinclude', function () {
	return gulp
		.src('./src/*.html')
		.pipe(plumber(plumberConfig('Html')))
		.pipe(fileInclude(fileincludeSettings))
		.pipe(gulp.dest('./dist/'));
});
// =========================================================================================================================
const scss = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');
// const mediaQueries = require('gulp-group-css-media-queries');

// const plumberScssConfig = {
// 	errorHandler: notify.onError({
// 		title: 'Styles', // место откуда пришла ошибка
// 		message: 'Error <%= error.message %>', // шаблон из документации notify
// 		sound: false,
// 	}),
// };

gulp.task('sass', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(plumber(plumberConfig('Styles')))
			.pipe(sourceMaps.init())
			.pipe(scss())
			// .pipe(mediaQueries())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./dist/css'))
	);
});
// =========================================================================================================================

gulp.task('copy-images', function () {
	return gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img'));
});

gulp.task('copy-fonts', function () {
	return gulp.src('./src/fonts/**/*').pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy-files', function () {
	return gulp.src('./src/files/**/*').pipe(gulp.dest('./dist/files'));
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

const fs = require('fs');

const clean = require('gulp-clean');

gulp.task('clear', function (done) {
	if (fs.existsSync('./dist/')) {
		return gulp.src('./dist/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});
// =========================================================================================================================

gulp.task('watch', function () {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('./src/**/*.html', gulp.parallel('fileinclude'));
	gulp.watch('./src/img/**/*', gulp.parallel('copy-images'));
	gulp.watch('./src/fonts/**/*', gulp.parallel('copy-fonts'));
	gulp.watch('./src/files/**/*', gulp.parallel('copy-files'));
});
// =========================================================================================================================

gulp.task(
	'default',
	gulp.series(
		'clear',
		gulp.parallel('sass', 'fileinclude', 'copy-images', 'copy-fonts', 'copy-files'),
		gulp.parallel('startServer', 'watch'),
	),
);
// =========================================================================================================================

// =========================================================================================================================
