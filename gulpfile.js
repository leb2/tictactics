
/* Run this command to install
npm install --save-dev gulp gulp-autoprefixer gulp-sass gulp-rename gulp-minify-css wiredep browser-sync
*/

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var concat = require('gulp-concat');
var bowerMin = require('bower-min');
var bowerMinJavaScriptFiles = bowerMin('js','min.js');
var sassDir = './static/sass/*.scss';
var templatesDir = './templates/';

gulp.task('scripts', function() {
    return gulp.src(bowerMinJavaScriptFiles.normal)
        .pipe(concat('vendor-scripts.js'))
        .pipe(gulp.dest('static/scripts'))
});

gulp.task('bower', function() {
    gulp.src(templatesDir + '*.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest(templatesDir));
});

gulp.task('sass', function() {
    return gulp.src(sassDir)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./static/styles'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        proxy: 'localhost:8000'
    });
    gulp.watch(sassDir, ['sass']);
    gulp.watch(templatesDir + '*.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
