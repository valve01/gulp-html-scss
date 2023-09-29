// const gulp = require('gulp');

// gulp.task("hello", function(){
// 	console.log("hello gulp")
// })

function defaultTask(cb) {
	console.log("hello")
	cb();
}
exports.default = defaultTask;
