var gulp = require('gulp');
var del = require('del');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var config = require('config');
var jquery = require('jquery');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace');
var changed = require('gulp-changed');
var httpProxy = require('http-proxy');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var path = require('path');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var sftp = require('gulp-sftp');
var stripDebug = require('gulp-strip-debug');
var bowerResolve = require('bower-resolve');
var less = require('gulp-less');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new LessPluginCleanCSS({ advanced: false });
var sourcemaps = require('gulp-sourcemaps');

/*
 ************************************** Extend browserify ************************************
 */
browserify.prototype.requires = function(files) {
    var b = this;

    files.forEach(function(file) {
        b.require(file);
    });

    return this;
};

browserify.prototype.externals = function(files) {
    var b = this;

    files.forEach(function(file) {
        b.external(file);
    });

    return this;
};

/*
 ************************************** Tasks start ******************************************
 */
var publicPath = path.resolve(__dirname, config.app.public);
var imgPath = path.resolve(__dirname, config.app.public, 'img');
var cssPath = path.resolve(__dirname, config.app.public, 'css');
var jsPath = path.resolve(__dirname, config.app.public, 'js');
var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});
var bowerJson = require('./bower.json');
var bowerDeps = Object.keys(bowerJson && bowerJson.dependencies || {});
var isProduction = process.env.NODE_ENV === 'production';


/**
 * html
 */
gulp.task('html', function() {
    return gulp.src('app/index.html')
        .pipe(replace(/<%app_title%>/g, config.app.title))
        .pipe(gulp.dest(publicPath));
});


/**
 * minify images
 */
gulp.task('img', function() {
    return gulp.src('app/images/**')
        .pipe(changed(imgPath))
        .pipe(gulpif(isProduction, imagemin())) // Optimize
        .pipe(gulp.dest(imgPath));
});


/**
 * compile css
 */
gulp.task('css', function() {
    var plugin = isProduction ? [cleancss] : [];

    return gulp.src(['app/styles/**'])
        .pipe(gulpif(!isProduction, sourcemaps.init()))
        .pipe(less({plugin: plugin}))
        .pipe(gulpif(!isProduction, sourcemaps.write()))
        .pipe(gulp.dest(cssPath));
});


/**
 * compile javascripts
 */
gulp.task('js', function() {
    var entries = argv.online ? 
        ["./app/scripts/main.js"] : 
        ["./test/fakeServer.js", "./app/scripts/main.js"];

    var bundler = browserify({
        entries: entries,
        extensions: ['.js', '.hbs'],
        debug: !isProduction
    });

    bowerDeps.forEach(function(id) {
        bundler.external(id);
    });

    return bundler
        .externals(dependencies)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulpif(isProduction, buffer()))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulpif(isProduction, stripDebug()))
        .pipe(gulp.dest(jsPath));
});


/**
 * browserify js for vendor js
 **/
gulp.task('vendor', function() {

    var bundler = browserify();

    bowerDeps.forEach(function(id) {
        bundler.require(bowerResolve.fastReadSync(id), {
            expose: id
        });
    });

    return bundler
        .requires(dependencies)
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulpif(isProduction, buffer()))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulpif(isProduction, stripDebug()))
        .pipe(gulp.dest(jsPath));
});


/**
 * clean build
 **/
gulp.task('clean', function(cb) {
  del(['build'], cb);
});


/*
 ****************************************Batch Commands********************************************
 */

// ajax 转发后台的代理
var proxy = httpProxy.createProxyServer({
    target: config.server.url
});

proxy.on('error', function(ex) {
    console.log(ex);
});

var proxyMiddleware = function(req, res, next) {
    try {
        if (req && req.url && req.url.indexOf('api') != -1) {
            proxy.web(req, res);
        } else {
            next();
        }
    } catch (ex) {
        console.log(ex);
    }
};

gulp.task('default', ['build'], function() {

    browserSync({
        server: {
            baseDir: config.app.public,
            middleware: proxyMiddleware
        },
        browser: config.browser
    });

    // watch everything
    gulp.watch('app/*.html', ['html', browserSync.reload]);
    gulp.watch('app/styles/**', ['css', browserSync.reload]);
    gulp.watch('app/images/**', ['img', browserSync.reload]);
    gulp.watch(['app/scripts/**', 'app/templates/**'], ['js', browserSync.reload]);
    if(!argv.online) gulp.watch(['test/fakeServer.js', 'test/data/**'], ['js', browserSync.reload]);
    gulp.watch('package.json', ['vendor', browserSync.reload]);

});

gulp.task('build', ['html', 'css', 'img', 'js', 'vendor'], function() {
    console.log(argv.online ? 'Be careful it is connected to the online server' : 'Running offline');
    console.log('NODE_ENV: ' + process.env.NODE_ENV);
});

gulp.task('deploy', ['build'], function() {
    return gulp.src(publicPath + '/**')
        .pipe(sftp({
            host: config.deployment.host,
            port: config.deployment.port,
            user: config.deployment.user,
            remotePath: config.deployment.remotePath
        }));
});
