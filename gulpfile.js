var gulp = require("gulp"),
    watch = require('gulp-watch'),
    scss = require("gulp-sass"),
    browserSync = require("browser-sync"),
    autoprefixer = require("gulp-autoprefixer"),
    imagemin = require("gulp-imagemin"),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    rimraf = require('rimraf');


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
    watch: { // Which files will be watched
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
gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Styles task → compiles scss, adds soucemaps, vendor prefixes and reloads the page
gulp.task('style:build', function() {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(browserSync.reload({
            stream: true
        }));
});

// JS task → adds sourcemaps and compresses js files
gulp.task('js:build', function() {
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
gulp.task('image:build', function() {
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


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


// Fonts task → copies fonts from 'src' folder to 'build'
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


// Clean task → deletes 'build' folder
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


// Build task → builds project together
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


// Default task
gulp.task('default', ['build', 'webserver', 'watch']);
