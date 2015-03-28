var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var glob = require('glob');
var jsonServer = require('json-server');
var plumber = require('gulp-plumber');
var browser = require('browser-sync');
var db = require('./db.json');

var paths = {
    basedir: './',
    jsx: './src/**/*.jsx',
    js: './build',
    html: './public/**/*.html'
};

gulp.task('js', function(){
    var jsxs = glob.sync('./src/**/*.jsx');
    var b = browserify({
        entries: jsxs,
        transform: [reactify]
    });
    return b.bundle()
        .pipe(plumber())
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browser.reload({stream:true}));
});

gulp.task('html', function(){
    return gulp.src('./public/**/*.html')
        .pipe(plumber())
        .pipe(browser.reload({stream:true}));
});

gulp.task('watch', function(){
    gulp.watch('./src/**/*.jsx',['js']);
    gulp.watch('./public/**/*.html',['html']);
});

gulp.task('autoreload', function(){
    browser({
        port: 7000,
        notify: false,
        proxy: 'localhost:3000'
        //browser: 'Google Chrome'

       //when use own server.
       // server: {
       //     basedir: './public'
       //}
    });
});

gulp.task('runserver', function(){
    var router = jsonServer.router(db);
	 var server = jsonServer.create();
    server.use(router);
    server.listen(3000);
});

gulp.task('default',['autoreload','watch','runserver']);