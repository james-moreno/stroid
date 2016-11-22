var gulp = require('gulp')
var sass = require('gulp-sass')
var nodemon = require('gulp-nodemon')
var browserSync = require('browser-sync').create()

gulp.task('browser-sync', ['nodemon'], function() {
    return browserSync.init({
        proxy: 'localhost:8080',
        ws: true,
        port: 5000,
        open: false,
        notify: true,
        ghostMode: false
    }) 
})

gulp.task('nodemon', function(cb) {
    var called = false;

    var stream = nodemon({
        script: 'server.js'
    })
    stream.on('start', function() {
        if (!called) {
            called = true;
            cb()
        }
    })
    .on('crash', function() {
        console.error('Crashed for whatever reason yo, gimme like 10 seconds and ill start back up')
        stream.emit('restart', 10)
    })

    return stream
})

gulp.task('sass', function() {
    return gulp.src('./client/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/css'))
        .pipe(browserSync.stream())
})

gulp.task('watch', function() {
    gulp.watch('./client/scss/*.scss', ['sass'])
    gulp.watch('./client/**/*.js').on('change', browserSync.reload)
    gulp.watch('./client/**/*.html').on('change', browserSync.reload)
})

gulp.task('default', ['browser-sync', 'watch'])
