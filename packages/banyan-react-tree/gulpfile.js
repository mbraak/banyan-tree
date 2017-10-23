const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");

gulp.task("lib_ts", function() {
    const tsProject = ts.createProject("tsconfig.json");

    const { js, dts } = gulp
        .src("./src/**/*.ts*")
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    js.pipe(sourcemaps.write("./")).pipe(gulp.dest("./lib"));

    dts.pipe(gulp.dest("./lib"));
});

gulp.task("css", function() {
    return gulp
        .src("./css/*.css")
        .pipe(postcss())
        .pipe(gulp.dest("./"));
});

gulp.task("default", ["lib_ts", "css"]);
