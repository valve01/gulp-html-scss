const { src, dest, watch } = require('gulp');
const fs = require('fs');
const clean = require('gulp-clean');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const server = require('gulp-server-livereload');

//HTML
const fileInclude = require('gulp-file-include');

//SCSS
const sassGlob = require('gulp-sass-glob');
const scss = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');
// const mediaQueries = require('gulp-group-css-media-queries');//конфиликтует с sourcemaps

//JS
const notify = require('gulp-notify');
const webpack = require('webpack-stream');

//Images
const svgSprite = require('gulp-svg-sprite');

//Fonts
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

// =============================================================== Const =====================================================================

const fileIncludeSettings = { prefix: '@@', basepath: '@file' };

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

function cleanDev(done) {
	if (fs.existsSync('./build/')) {
		return src(['./build/'], { read: false }).pipe(clean({ force: true }));
	}
	done();
}

// ============================================================= HTML ================================================================

function htmlIncludeDev() {
	return src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
		.pipe(changed('./build/', { hasChanged: changed.compareContents })) // Настройка нужна, чтобы при изменении файлов, подключенных к index.html сам index.html также пересобирался
		.pipe(plumber(plumberConfig('Html')))
		.pipe(fileInclude(fileIncludeSettings))
		.pipe(dest('./build/'));
}

// ============================================================ SCSS ================================================================

function scssDev() {
	return (
		src('./src/scss/*.scss')
			.pipe(changed('./build/css/'))
			.pipe(plumber(plumberConfig('Styles')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			.pipe(scss())
			// .pipe(mediaQueries())// Конфликтует с sourceMaps. Включать отдельно друг от друга
			.pipe(sourceMaps.write())
			.pipe(dest('./build/css/'))
	);
}

// ========================================================== Images ==================================================================

function copyImagesDev() {
	return (
		src(['./src/img/**/*', '!./src/img/**/*.svg'])
			.pipe(changed('./build/img/'))
			// .pipe(imagemin({ verbose: true })) // настройка включает отображение в консоли какие файлы были оптимизированы и сколько места сэкономлено
			.pipe(dest('./build/img/'))
	);
}

function spriteDev() {
	return src('./src/img/**/*.svg')
		.pipe(changed('./build/img/'))
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
						example: true, //отвечает за создания папки stack с вложенным в нее файлом sprite.stack.html , где есть примеры применения конкрентного файла из спрайта
					},
				},
			}),
		)
		.pipe(dest('./build/img/'));
}

// ========================================================== Fonts ==================================================================

function fontsDev() {
	return (
		src('./src/fonts/**/*')
			.pipe(changed('./build/fonts'))
			.pipe(
				fonter({
					formats: ['woff', 'ttf'], // любые форматы конвертирует в woof и ttf
				}),
			)
			//Второй раз обращаемся только к ttf файлам// В шрифтах мы не делаем 		.pipe(dest('./build/fonts'))		 перед тем как обратиться к только что сконвертированному ttf
			.pipe(src('./build/fonts/**/*.ttf'))
			.pipe(changed('./build/fonts'))
			.pipe(ttf2woff2())
			.pipe(dest('./build/fonts'))
	);
}

// ========================================================== CopyFiles ==================================================================

function copyFilesDev() {
	return src('./src/files/**/*').pipe(changed('./build/files')).pipe(dest('./build/files'));
}

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

// =========================================================== Server ============================================================

function startServerDev() {
	return src('./build/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
}

// ========================================================= Watch =======================================================================

function watchDev() {
	watch('./src/scss/**/*.scss', scssDev);
	watch('./src/fonts/**/*', fontsDev);
	watch('./src/js/**/*.js', jsDev);
	watch('./src/**/*.html', htmlIncludeDev);
	watch('./src/img/**/*.svg', spriteDev);
	watch(['./src/img/**/*', '!./src/img/**/*.svg'], copyImagesDev);
	watch('./src/files/**/*', copyFilesDev);
}
//============================================================================================================================================

exports.cleanDev = cleanDev;
exports.htmlIncludeDev = htmlIncludeDev;
exports.scssDev = scssDev;
exports.copyImagesDev = copyImagesDev;
exports.spriteDev = spriteDev;
exports.fontsDev = fontsDev;
exports.copyFilesDev = copyFilesDev;
exports.jsDev = jsDev;
exports.startServerDev = startServerDev;
exports.watchDev = watchDev;
