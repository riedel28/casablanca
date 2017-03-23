var gulp = require("gulp"),
    scss = require("gulp-sass"),
    browserSync = require("browser-sync"),
    autoprefixer = require("autoprefixer");

// Sass compilation
gulp.task("scss", function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(scss(autoprefixer))
        .pipe(gulp.dest("src/css/"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Browser-Sync live reload
gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "./src/"
        }
    });
});

// Watch task
gulp.task("watch", ["browser-sync", "scss"], function() {
    gulp.watch("src/scss/**/*.scss", ["scss"]);
    gulp.watch("src/**/*.html", browserSync.reload);
    gulp.watch("src/js/**/*.js", browserSync.reload);
});
