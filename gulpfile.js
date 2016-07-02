var gulp = require('gulp'),
    swig = require('gulp-swig'),
    minifyHtml = require("gulp-minify-html"),
    less = require("gulp-less"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

var paths = {
    html: 'src/app/**/*.html',
    js: 'src/app/**/*.js',
    css: 'src/css/**/*.less',
    images: 'src/images/*'
};


gulp.task('build-html', function () {
    gulp.src([paths.html])
        .pipe(swig({
            defaults: {cache: false}
        }))
        // .pipe(minifyHtml())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('build-css', function () {
    gulp.src([paths.css])
        .pipe(less())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build-img', function () {
    gulp.src([paths.images])
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('index-js', function () {
    return gulp.src('src/app/pages/index/*.js')
        //.pipe(uglify())
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('baike-js', function () {
    return gulp.src('src/app/pages/baike/*.js')
        //.pipe(uglify())
        .pipe(concat('baike.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('journal-js', function () {
    return gulp.src('src/app/pages/journal/*.js')
        //.pipe(uglify())
        .pipe(concat('journal.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.html, ['build-html']);
    gulp.watch(paths.js, ['index-js', 'baike-js', 'journal-js']);
    gulp.watch('src/css/**/*.less', ['build-css']);
});

gulp.task('default', ['watch', 'build-html', 'index-js', 'baike-js', 'journal-js', 'build-css', 'build-img', 'server']);