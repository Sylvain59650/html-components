const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
const watch = require("gulp-watch");

const chemins = {
  sources: "./src/",
  distrib: "./distrib/",
  demo: "./docs/demo/modules/html-components.core/distrib/"
};



gulp.task("html-components.core.min.js", () => {
  return gulp.src([
      "src/**/*.js"
    ])
    .pipe(concat("html-components.core.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: true,
      comments: false,
      minified: true
    }))
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("release", () => {
  return gulp.src([
      "src/**.js"
    ])
    .pipe(concat("html-components.core.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: true,
      comments: false,
      minified: true
    }))
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("base", () => {
  const t1 = gulp.src([
      "node_modules/htmlelement-extension/distrib/htmlelement.min.js"
    ])
    .pipe(gulp.dest(chemins.demo));

  const t2 = gulp.src([
      "node_modules/htmlelement-events-extension/distrib/htmlelement-events.min.js"
    ])
    .pipe(gulp.dest(chemins.demo));
  return [t1, t2];
});

gulp.task("demo", () => {
  return gulp.src([
      "src/**.js"
    ])
    .pipe(concat("html-components.core.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false,
      comments: false,
      minified: false
    }))
    .pipe(gulp.dest(chemins.demo))
});


gulp.task("select3", () => {
  return gulp.src([
      "src/select3/**.js"
    ])
    .pipe(concat("select3.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false,
      comments: false,
      minified: false
    }))
    .pipe(gulp.dest(chemins.distrib))
});

gulp.task("watch:html-components.core.min.js", function() {
  watch("./src/**.js", function() {
    gulp.run("html-components.core.min.js");
  });
});

gulp.task("backToTop", () => {
  return gulp.src([
      "src/backToTop/**.js"
    ])
    .pipe(concat("backToTop.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false,
      comments: false,
      minified: false
    }))
    .pipe(gulp.dest(chemins.distrib))
});


gulp.task("watch:backToTop", function() {
  watch("src/backToTop/**.js", function() {
    gulp.run("backToTop");
  });
});

gulp.task("watch:select3", function() {
  watch("src/select3/**.js", function() {
    gulp.run("select3");
  });
});


gulp.task("default", ["html-components.core.min.js", "demo"]);


gulp.task("all", ["default"]);

gulp.task("watch", ["watch:html-components.core.min.js"]);