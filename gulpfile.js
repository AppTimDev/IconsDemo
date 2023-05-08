const gulp = require('gulp');
const webserver = require('gulp-webserver');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const htmlreplace = require('gulp-html-replace');
const minifyHTML = require('gulp-minify-html');
const rimraf = require('rimraf');
const copy = require('gulp-contrib-copy');
const browserSync = require('browser-sync').create();
const uglify_options = {
    //https://github.com/mishoo/UglifyJS
    mangle: {
        toplevel: true
    },
    compress: {
        drop_console: true
    },
    output: {
        beautify: false,
        comments: false,
        // preamble: "/* uglified */"
    }
}
const path = {
    src_folder: 'src/',
    dest_folder: 'dest/',
    dest_js_folder: 'dest/js/',
    dest_css_folder: 'dest/css/',
    src_lib_files: 'src/lib/**',
    src_lib_folder: 'src/lib',
    dest_lib_folder: 'dest/lib',

    src_files: 'src/**',
    src_images_files: 'src/images/**/*',
    src_icons_files: 'src/icons/**/*',
    src_ico_file: 'src/favicon.ico',

    dest_files: 'dest/**',
    publish_files: 'publish/**',
    publish_folder: 'publish/',
    deploy_folder: 'deploy',
}
function browserSyncInit(baseDir, port){
    browserSync.init({
        server: {
            baseDir: baseDir,
        },
        port: port
    });
}

gulp.task('browser-dev', () => {
    browserSyncInit(path.src_folder, 3000)
});

gulp.task('browser-pro', () => {
    browserSyncInit(path.dest_folder, 8080)
});
gulp.task('watch-dev', function () {
    gulp.watch(path.src_files).on('change', browserSync.reload);
});

gulp.task('build', ['html', 'css', 'js']);
gulp.task('build-all', ['build', 'images', 'copy-lib']);
gulp.task('build-reload', ['build'], function(done) {
    browserSync.reload();
    done();
});
//browser-pro
//if any files change in source files,i.e. watch-pro task
//build task --> browserSync.reload
gulp.task('watch-pro', function () {
    gulp.watch(path.src_files, ['build-reload']);
});

gulp.task('dev', ['browser-dev', 'watch-dev']);
gulp.task('pro', ['build','browser-pro', 'watch-pro']);

gulp.task('server', function () {
    gulp.src(path.dest_folder)
        .pipe(webserver({
            port: 8080,
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html'
        }));
});

//concat all css files
gulp.task('concat-css', function () {
    return gulp.src('./src/css/*.css')
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(path.dest_css_folder));
});

//concat all js files
gulp.task('concat-js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(path.dest_js_folder));
});

//minify css file
gulp.task('minify-css', ['concat-css'], function () {
    return gulp.src('./dest/css/bundle.css')
        .pipe(minifyCSS({
            keepBreaks: false,
        }))
        .pipe(rename(function (path) {
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest(path.dest_css_folder));
});

//concat all css files into one bundle css file and minify this file
gulp.task('css', function () {
    return gulp.src([
            './src/css/site/order/root.css', 
            './src/css/site/*.css',
            './src/css/*.css'
        ])
        .pipe(concat('bundle.min.css'))
        .pipe(minifyCSS({
            keepBreaks: false,
        }))
        .pipe(gulp.dest(path.dest_css_folder));
});

//concat all css files into one bundle css file in order 
//and minify this file
gulp.task('css-site', function () {
    return gulp.src([
            './src/css/site/order/root.css', 
            './src/css/site/*.css',
        ])
        .pipe(concat('site.min.css'))
        .pipe(minifyCSS({
            keepBreaks: false,
        }))
        .pipe(gulp.dest(path.dest_css_folder));
});

//concat all js files into one bundle js file and minify this file
gulp.task('js', function () {
    return gulp.src([
            './src/js/site/order/root.js', 
            './src/js/site/*.js',
            './src/js/*.js'
        ])    
        .pipe(concat('bundle.min.js'))
        .pipe(uglify(uglify_options))
        .pipe(gulp.dest(path.dest_js_folder));
});

//uglify all js files and concat them to a bundle file
gulp.task('bundle-js', ['concat-js'], function () {
    return gulp.src('./dest/js/bundle.js')
        .pipe(uglify(uglify_options))
        .pipe(rename(function (path) {
            path.basename += ".min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest(path.dest_js_folder));
});

//uglify each js file
gulp.task('uglify', function () {
    return gulp.src('./src/js/*.js')
        .pipe(uglify(uglify_options))
        .pipe(rename(function (path) {
            path.basename += ".min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest(path.dest_js_folder));
});

gulp.task('html', function () {
    var options = {
        comments: false,
        spare: false,
        quotes: true
    };
    return gulp.src('./src/*.html')
        .pipe(htmlreplace({
            'css': 'css/bundle.min.css',
            'js': {
                src: 'js/bundle.min.js', tpl: '<script src="%s" defer></script>'
            }
        }))
        .pipe(minifyHTML(options))
        .pipe(gulp.dest('./dest/'));
});

//remove all files of the destination folder
gulp.task('clean', function (cb) {
    rimraf(path.dest_files, cb);
});

//Copy files to destination folder
gulp.task('copy-to-publish', function () {
    gulp.src(path.dest_files)
        .pipe(copy())
        .pipe(gulp.dest(path.publish_folder));
});
gulp.task('copy-to-deploy', function () {
    gulp.src(path.dest_files)
        .pipe(copy())
        .pipe(gulp.dest(path.deploy_folder));
});

gulp.task('copy-images', function() {
    return gulp.src(path.src_images_files)
        .pipe(copy())
        .pipe(gulp.dest('dest/images'));
  });
gulp.task('copy-icons', function() {
    return gulp.src(path.src_icons_files)
        .pipe(copy())
        .pipe(gulp.dest('dest/icons'));
});
gulp.task('copy-ico', function() {
    return gulp.src(path.src_ico_file)
        .pipe(copy())
        .pipe(gulp.dest('dest'));
    });

gulp.task('copy-lib', function() {
    return gulp.src(path.src_lib_files)
        .pipe(copy())
        .pipe(gulp.dest(path.dest_lib_folder));
    });
// Copy all static images, icons, ico
gulp.task('images', ['copy-images', 'copy-icons', 'copy-ico'], function () {
    console.log("Copy all static images, icons, ico files.");
});

//publish the production codes to the publish folder
gulp.task('publish', ['build', 'images'], function () {
    gulp.start('copy-to-publish');
});
//publish the production codes to the publish folder
gulp.task('deploy', ['build', 'images'], function () {
    gulp.start('copy-to-deploy');
});

gulp.task('default', ['build', 'pro']);

