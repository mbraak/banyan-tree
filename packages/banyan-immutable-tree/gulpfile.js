const gulp = require("gulp");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("lib_ts", function() {
    const tsProject = ts.createProject("tsconfig.json");

    const { js, dts } = gulp
        .src("./src/**/*.ts*")
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    js
        .pipe(babel({ presets: "es2015" }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./lib"));

    dts.pipe(gulp.dest("./lib"));
});

gulp.task("default", ["lib_ts"]);
