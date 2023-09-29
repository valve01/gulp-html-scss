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

gulp.task('fileinclude', function (done) {
	gulp
	.src('./src/*.html')
	.pipe(fileInclude(fileincludeSettings))
	.pipe(gulp.dest('./dist/'));
	done()
});
// =========================================================================================================================
const scss = require("gulp-sass")(require("sass"))

gulp.task ("sass", function(done){
	gulp
	.src("./src/scss/*.scss")
	.pipe(scss())
	.pipe(gulp.dest("./dist/css"))
	done()
})
// =========================================================================================================================

gulp.task ("copy-files",function(done){
	gulp
	.src("./src/img/**/*")
	.pipe(gulp.dest("./dist/img"))
	done()
})


