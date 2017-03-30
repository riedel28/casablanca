var gulp = require('gulp'),
    watch = require('gulp-watch'),
    scss = require("gulp-sass"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    uglify = require("gulp-uglify"),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');


var path = {
    build: { // Path for the production folder
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { // Source files
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // Files to watch
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build' // Deletes 'build' folder
};

var config = {
    server: {
        baseDir: "./build"
    }
    // tunnel: true,
    // host: 'localhost',
    // port: 3000
};

// Server task
gulp.task('webserver', function () {
    browserSync(config);
});

// HTML task → copies html files and reloads the page
gulp.task('html', function() {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Styles task → compiles scss, adds soucemaps, vendor prefixes and reloads the page
gulp.task('styles', function() {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// JS task → adds sourcemaps and compresses js files
gulp.task('js', function() {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Images task → copies and minifies images
gulp.task('images', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// SVG sprite task → makes a sprite from svg files
gulp.task('sprite', function() {
    return gulp.src('img/icons/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('symbols.svg'))
        .pipe(gulp.dest('img'));
});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('styles');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});


// Fonts task → copies fonts from 'src' folder to 'build'
gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


// Clean task → deletes 'build' folder
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


// Build task → builds project together
gulp.task('build', [
    'html',
    'js',
    'styles',
    'fonts',
    'images'
]);


// Default task
gulp.task('default', ['build', 'webserver', 'watch']);
