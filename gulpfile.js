var gulp = require('gulp');
var less = require('gulp-less'); 
var webpack = require('webpack-stream');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
 
 var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './bundle/');
var APP_DIR = path.resolve(__dirname, './');

/* Task to compile less */
gulp.task('compile-less', function() {  
  gulp.src('./less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./css/'));
}); 
/* Task to watch less changes */
gulp.task('watch-less', function() {  
  gulp.watch('./less/**/*.less' , ['compile-less']);
});
gulp.task('webpack', function() {
  return gulp.src('./index.js')
  .pipe(webpack({
    watch: true,
    entry: ["whatwg-fetch", "babel-polyfill", "./index.js"],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
  }))
  .pipe(gulp.dest('bundle/'));
});
gulp.task('serve', function () {
 
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    }); 
    gulp.watch("./less/*.less").on("change", reload);
    gulp.watch("./*.html").on("change", reload);
    gulp.watch("./bundle/*.js").on("change", reload);
});
 
/* Task when running `gulp` from terminal */
gulp.task('default', ['webpack', 'watch-less', 'serve']);