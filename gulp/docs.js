const { src, dest } = require('gulp');

//HTML
const htmlInclude = require('gulp-file-include');
const htmlClean = require('gulp-htmlclean');
const avifWebpHtml = require('gulp-avif-webp-html');

//SCSS
const sassGlob = require('gulp-sass-glob');
const scss = require('gulp-sass')(require('sass'));
const sourceMaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
const avifCss = require('gulp-avif-css');
// const mediaQueries = require('gulp-group-css-media-queries');

//JS
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

//Images
// const cached = require('gulp-cached');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');

//Fonts
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

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

function cleanDocs() {
	if (fs.existsSync('./docs/')) {
		return src('./docs/', { read: false }).pipe(clean({ force: true }));
	}
}
exports.cleanDocs = cleanDocs;

// ============================================================= HTML ================================================================

function htmlIncludeDocs() {
	return src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
		.pipe(changed('./docs/'))
		.pipe(plumber(plumberConfig('Html')))
		.pipe(htmlInclude(htmlIncludeSettings))
		.pipe(avifWebpHtml())
		.pipe(htmlClean())
		.pipe(dest('./docs/'));
}
exports.htmlIncludeDocs = htmlIncludeDocs;

// ============================================================ SCSS ================================================================
function scssDocs() {
	return (
		src('./src/scss/*.scss')
			.pipe(changed('./docs/css/'))
			.pipe(plumber(plumberConfig('Styles')))
			.pipe(sourceMaps.init())
			.pipe(autoprefixer()) // не срабатывет не может прочитать нужен postcss-scss parser (такая ошибка вылазит если будет комментарий в scss)
			.pipe(sassGlob())
			.pipe(webpCss())
			.pipe(avifCss())
			.pipe(scss())
			.pipe(csso())
			// .pipe(mediaQueries())// Конфликтует с sourceMaps. Включать отдельно друг от друга
			.pipe(sourceMaps.write())
			.pipe(dest('./docs/css/'))
	);
}
exports.scssDocs = scssDocs;
// ========================================================== Images ==================================================================

function imagesDocs() {
	return (
		src(['./src/img/**/*', '!./src/img/**/*.svg'])
			.pipe(changed('./docs/img/'))
			.pipe(avif({ quality: 50 }))
			.pipe(dest('./docs/img/'))
			// Два раза обращаемся к /img/
			.pipe(src(['./src/img/**/*', '!./src/img/**/*.svg']))
			.pipe(changed('./docs/img/'))
			.pipe(webp())
			.pipe(dest('./docs/img/'))
			// Третий раза обращаемся к /img/
			.pipe(src(['./src/img/**/*', '!./src/img/**/*.svg']))
			.pipe(changed('./docs/img/'))
			.pipe(imagemin({ verbose: true }))
			.pipe(dest('./docs/img/'))
	);
}
exports.imagesDocs = imagesDocs;

function spriteDocs() {
	return src('./src/img/**/*.svg')
		.pipe(changed('./docs/img/'))
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
						example: true,
					},
				},
			}),
		)
		.pipe(dest('./docs/img/'));
}
exports.spriteDocs = spriteDocs;

// ========================================================== Fonts ==================================================================
function fontsDocs() {
	return src('./src/fonts/**/*')
		.pipe(changed('./docs/fonts'))
		.pipe(
			fonter({
				formats: ['woff', 'ttf'], // любые форматы конвертирует в woof и ttf
			}),
		)
//Второй раз обращаемся только к ttf файлам// В шрифтах мы не делаем 		.pipe(dest('./docs/fonts'))		 перед тем как обратиться к только что сконвертированному ttf
		.pipe(src('./docs/fonts/**/*.ttf'))
		.pipe(changed('./docs/fonts'))
		.pipe(ttf2woff2())
		.pipe(dest('./docs/fonts'));
}

exports.fontsDocs = fontsDocs;


// ========================================================== CopyFiles ==================================================================

function copyFilesDocs() {
	return src('./src/files/**/*').pipe(changed('./docs/files')).pipe(dest('./docs/files'));
}
exports.copyFilesDocs = copyFilesDocs;
// ============================================================== JS ===================================================================

function jsDocs() {
	return src('./js/*.js')
		.pipe(changed('./docs/js'))
		.pipe(plumber(plumberConfig('JS')))
		.pipe(babel())
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(dest('./docs/js'));
}
exports.jsDocs = jsDocs;
// =========================================================== Server ============================================================

function startServerDocs() {
	return src('./docs/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
}
exports.startServerDocs = startServerDocs;

// =========================================================================================================================
