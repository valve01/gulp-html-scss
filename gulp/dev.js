const gulp = require('gulp');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
// const babel = require('gulp-babel');
// const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sassGlob = require('gulp-sass-glob');
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
const htmlInclude = require('gulp-file-include');

const htmlIncludeSettings = { prefix: '@@', basepath: '@file' };

// const plumberHtmlConfig = {
// 	errorHandler: notify.onError({
// 		title: 'Html', // место откуда пришла ошибка
// 		message: 'Error <%= error.message %>', // шаблон из документации notify
// 		sound: false,
// 	}),
// };

gulp.task('htmlInclude:dev', function () {
	return gulp
		.src(['./src/html/**/*.html','!./src/html/blocks/*.html'])
		.pipe(changed('./build/', { hasChanged: changed.compareContents }))// Настройка нужна, чтобы при изменении файлов, подключенных к index.html сам index.html также пересобирался
		.pipe(plumber(plumberConfig('Html')))
		.pipe(htmlInclude(htmlIncludeSettings))
		.pipe(gulp.dest('./build/'));
});
// =========================================================================================================================
const scss = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');


gulp.task('sass:dev', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(changed('./build/css/'))
			.pipe(plumber(plumberConfig('Styles')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			.pipe(scss())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./build/css/'))
	);
});
// =========================================================================================================================

gulp.task('copy-images:dev', function () {
	return gulp
		.src('./src/img/**/*')
		.pipe(changed('./build/img/'))
		// .pipe(imagemin({ verbose: true })) // настройка включает отображение в консоли какие файлы были оптимизированы и сколько места сэкономлено
		.pipe(gulp.dest('./build/img/'));
});

gulp.task('copy-fonts:dev', function () {
	return gulp.src('./src/fonts/**/*').pipe(changed('./build/fonts')).pipe(gulp.dest('./build/fonts'));
});

gulp.task('copy-files:dev', function () {
	return gulp.src('./src/files/**/*').pipe(changed('./build/files')).pipe(gulp.dest('./build/files'));
});
// =========================================================================================================================

gulp.task('js:dev', function () {
	return gulp
		.src('./js/*.js')
		.pipe(changed('./build/js'))
		.pipe(plumber(plumberConfig('JS')))
		// .pipe(babel())//выключен в dev режиме
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(gulp.dest('./build/js'));
});

// =========================================================================================================================

const server = require('gulp-server-livereload');

gulp.task('startServer:dev', function () {
	return gulp.src('./build/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
});
// =========================================================================================================================

const fs = require('fs');

const clean = require('gulp-clean');

gulp.task('clear:dev', function (done) {
	if (fs.existsSync('./build/')) {
		return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});
// =========================================================================================================================

gulp.task('watch:dev', function () {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch('./src/**/*.html', gulp.parallel('htmlInclude:dev'));
	gulp.watch('./src/img/**/*', gulp.parallel('copy-images:dev'));
	gulp.watch('./src/fonts/**/*', gulp.parallel('copy-fonts:dev'));
	gulp.watch('./src/files/**/*', gulp.parallel('copy-files:dev'));
	gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});
// =========================================================================================================================


// =========================================================================================================================

// =========================================================================================================================
