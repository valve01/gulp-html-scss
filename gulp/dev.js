const gulp = require('gulp');

//HTML
const htmlInclude = require('gulp-file-include');


//SCSS
const sassGlob = require('gulp-sass-glob');
const scss = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');

//JS
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
// const babel = require('gulp-babel');

// const imagemin = require('gulp-imagemin');
const fs = require('fs');
const clean = require('gulp-clean');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const server = require('gulp-server-livereload');

// =============================================================== Const =====================================================================

const htmlIncludeSettings = { prefix: '@@', basepath: '@file' };

const plumberConfig = (title) => {
	return {
		errorHandler: notify.onError({
			title, // место откуда пришла ошибка
			message: 'Error <%= error.message %>', // шаблон из документации notify
			sound: false,
		}),
	};
};

// ============================================================ Tasks ================================================================

// ============================================================= HTML ================================================================

gulp.task('htmlInclude:dev', function () {
	return gulp
		.src(['./src/html/**/*.html','!./src/html/blocks/*.html'])
		.pipe(changed('./build/', { hasChanged: changed.compareContents }))// Настройка нужна, чтобы при изменении файлов, подключенных к index.html сам index.html также пересобирался
		.pipe(plumber(plumberConfig('Html')))
		.pipe(htmlInclude(htmlIncludeSettings))
		.pipe(gulp.dest('./build/'));
});
// ============================================================ SCSS ================================================================

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
// ========================================================== Copy ==================================================================

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
// ============================================================== JS ===================================================================

gulp.task('js:dev', function () {
	return gulp
		.src('./js/*.js')
		.pipe(changed('./build/js'))
		.pipe(plumber(plumberConfig('JS')))
		// .pipe(babel())//выключен в dev режиме
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(gulp.dest('./build/js'));
});

// =========================================================== Server ============================================================

gulp.task('startServer:dev', function () {
	return gulp.src('./build/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
});
// ========================================================== Clean ===============================================================

gulp.task('clear:dev', function (done) {
	if (fs.existsSync('./build/')) {
		return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});
// ========================================================= Watch =======================================================================

gulp.task('watch:dev', function () {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch('./src/**/*.html', gulp.parallel('htmlInclude:dev'));
	gulp.watch('./src/img/**/*', gulp.parallel('copy-images:dev'));
	gulp.watch('./src/fonts/**/*', gulp.parallel('copy-fonts:dev'));
	gulp.watch('./src/files/**/*', gulp.parallel('copy-files:dev'));
	gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});

