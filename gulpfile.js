var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var glob = require('glob');
var jsonServer = require('json-server');
var plumber = require('gulp-plumber');
var browser = require('browser-sync');
var db = require('./db.json');

var targets = {
    main: 'app.js',
    htmls: './public/**/*.html',
    jsxs: './src/**/*.jsx',
    buildd: './build',
    jsd: './public/js'
};

gulp.task('js', function(){
    var jsxs = glob.sync(targets.jsxs);
    var b = browserify({
        entries: jsxs,
        transform: [reactify]
    });
    return b.bundle()
        .pipe(plumber())
        .pipe(source(targets.main))
        .pipe(gulp.dest(targets.buildd))
        .pipe(gulp.dest(targets.jsd))
        .pipe(browser.reload({stream:true}));
});

gulp.task('html', function(){
    return gulp.src(targets.htmls)
        .pipe(plumber())
        .pipe(browser.reload({stream:true}));
});

gulp.task('watch', function(){
    gulp.watch(targets.jsxs,['js']);
    gulp.watch(targets.htmls,['html']);
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

/*
probably there is a bug in the module and when use POST API it cant update db.json,
so at the moment i use npm grobal json-server instead of this local module.
curiously its work.
*/
//gulp.task('runserver', function(){
//    var router = jsonServer.router(db);
//	 var server = jsonServer.create();
//   server.use(router);
//    server.listen(3000);
//});

gulp.task('default',['autoreload','watch']);
