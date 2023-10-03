const gulp = require('gulp');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
// =========================================================================================================================

const plumberConfig = (title) => {
	return {
		errorHandler: notify.onError({
			title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

// =========================================================================================================================
const htmlInclude = require('gulp-file-include');

const htmlIncludeSettings = { prefix: '@@', basepath: '@file' };

gulp.task('htmlInclude:docs', function () {
	return gulp
		.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
		.pipe(changed('./docs/'))
		.pipe(plumber(plumberConfig('Html')))
		.pipe(htmlInclude(htmlIncludeSettings))
		.pipe(gulp.dest('./docs/'));
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

gulp.task('sass:docs', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(changed('./docs/css/'))
			.pipe(plumber(plumberConfig('Styles')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			.pipe(scss())
			.pipe(autoprefixer())// не срабатывет не может прочитать нужен postcss-scss parser (такая ошибка вылазит если будет комментарий в scss)
			// .pipe(mediaQueries())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./docs/css/'))
	);
});


// =========================================================================================================================

gulp.task('copy-images:docs', function () {
	return gulp
		.src('./src/img/**/*')
		.pipe(changed('./docs/img/'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./docs/img/'));
});

gulp.task('copy-fonts:docs', function () {
	return gulp.src('./src/fonts/**/*').pipe(changed('./docs/fonts')).pipe(gulp.dest('./docs/fonts'));
});

gulp.task('copy-files:docs', function () {
	return gulp.src('./src/files/**/*').pipe(changed('./docs/files')).pipe(gulp.dest('./docs/files'));
});
// =========================================================================================================================

gulp.task('js:docs', function () {
	return gulp
		.src('./js/*.js')
		.pipe(changed('./docs/js'))
		.pipe(plumber(plumberConfig('JS')))
		.pipe(babel())
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(gulp.dest('./docs/js'));
});

// =========================================================================================================================

const server = require('gulp-server-livereload');

gulp.task('startServer:docs', function () {
	return gulp.src('./docs/').pipe(
		server({
			livereload: true,
			open: true,
		}),
	);
});
// =========================================================================================================================

const fs = require('fs');

const clean = require('gulp-clean');

gulp.task('clear:docs', function (done) {
	if (fs.existsSync('./docs/')) {
		return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});
// =========================================================================================================================

// =========================================================================================================================

// =========================================================================================================================

// =========================================================================================================================
