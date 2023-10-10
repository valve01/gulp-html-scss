const { src, dest, watch } = require('gulp');

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
// ============================================================ Clean ===============================================================

function clearDev() {
	if (fs.existsSync('./build/')) {
		return src('./build/', { read: false }).pipe(clean({ force: true }));
	}
}
exports.clearDev = clearDev;
// ============================================================= HTML ================================================================

function htmlIncludeDev() {
	return src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
		.pipe(changed('./build/', { hasChanged: changed.compareContents })) // Настройка нужна, чтобы при изменении файлов, подключенных к index.html сам index.html также пересобирался
		.pipe(plumber(plumberConfig('Html')))
		.pipe(htmlInclude(htmlIncludeSettings))
		.pipe(dest('./build/'));
}
exports.htmlIncludeDev = htmlIncludeDev;
// ============================================================ SCSS ================================================================

function scssDev() {
	return src('./src/scss/*.scss')
		.pipe(changed('./build/css/'))
		.pipe(plumber(plumberConfig('Styles')))
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(scss())
		.pipe(sourceMaps.write())
		.pipe(dest('./build/css/'));
}
exports.scssDev = scssDev;
// ========================================================== Copy ==================================================================

function copyImagesDev() {
	return (
		src('./src/img/**/*')
			.pipe(changed('./build/img/'))
			// .pipe(imagemin({ verbose: true })) // настройка включает отображение в консоли какие файлы были оптимизированы и сколько места сэкономлено
			.pipe(dest('./build/img/'))
	);
}
exports.copyImagesDev = copyImagesDev;

function copyFontsDev() {
	return src('./src/fonts/**/*').pipe(changed('./build/fonts')).pipe(dest('./build/fonts'));
}
exports.copyFontsDev = copyFontsDev;

function copyFilesDev() {
	return src('./src/files/**/*').pipe(changed('./build/files')).pipe(dest('./build/files'));
}
exports.copyFilesDev = copyFilesDev;
// ============================================================== JS ===================================================================

function jsDev() {
	return (
		src('./js/*.js')
			.pipe(changed('./build/js'))
			.pipe(plumber(plumberConfig('JS')))
			// .pipe(babel())//выключен в dev режиме
			.pipe(webpack(require('./../webpack.config.js')))
			.pipe(dest('./build/js'))
	);
}
exports.jsDev = jsDev;
// =========================================================== Server ============================================================

function startServerDev() {
	return src('./build/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
}
exports.startServerDev = startServerDev;

// ========================================================= Watch =======================================================================

function watchDev() {
	watch('./src/scss/**/*.scss', scssDev);
	watch('./src/**/*.html', htmlIncludeDev);
	watch('./src/img/**/*', copyImagesDev);
	watch('./src/fonts/**/*', copyFontsDev);
	watch('./src/files/**/*', copyFilesDev);
	watch('./src/js/**/*.js', jsDev);
}
exports.watchDev = watchDev;
