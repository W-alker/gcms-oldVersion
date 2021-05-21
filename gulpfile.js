const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');

//报错处理函数
function showError(error) {
    console.log(error.toString());
    this.emit('end');
}
//html文件压缩
gulp.task("htmlmin", function () {
    gulp.src("src/*.html")
        .pipe(fileinclude())
        .on('error', showError)

        .pipe(htmlmin({ collapseWhitespace: true }))
        .on('error', showError)

        .pipe(gulp.dest("./dist"))
        //自动刷新
        .pipe(connect.reload())
})
//css代码压缩
gulp.task("cssmin", function () {
    return gulp.src(["src/css/*.scss", "src/css/*.css"])
        .pipe(sass())
        .on('error', showError)

        .pipe(csso())
        .on('error', showError)

        .pipe(gulp.dest("./dist/css"))
        //自动刷新
        .pipe(connect.reload());
})

//js语法转换及代码压缩
gulp.task('jsmin', function () {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            //可以判断当前代码运行环境并将代码转化为当前运行环境支持的代码
            presets: ['@babel/env']
        }))
        .on('error', showError)
        .pipe(uglify())
        .on('error', showError)
        /*         .pipe(rename({
                    suffix:".min"
                })) */
        .pipe(gulp.dest('./dist/js'))
        //自动刷新
        .pipe(connect.reload())

})
gulp.task('jsmin-node', function () {
    return gulp.src('./src/*.js')
        .pipe(babel({
            //可以判断当前代码运行环境并将代码转化为当前运行环境支持的代码
            presets: ['@babel/env']
        }))
        .on('error', showError)
        .pipe(uglify())
        .on('error', showError)
        /*         .pipe(rename({
                    suffix:".min"
                })) */
        .pipe(gulp.dest('./dist/'))
        //自动刷新
        .pipe(connect.reload())

})

//图片拷贝处理
gulp.task("img", function () {
    gulp.src('./src/img/*')
        //.pipe(imgmin())`
        .pipe(gulp.dest("./dist/img"))
        .pipe(connect.reload())
})
//服务器任务
gulp.task("server", function () {
    connect.server({
        root: "./dist/",
        port: 5500,
        livereload: true
    })
})
//路由器任务
gulp.task("jsmin-routes", function () {
    gulp.src('./src/routes/*.js')
        .pipe(babel({
            //可以判断当前代码运行环境并将代码转化为当前运行环境支持的代码
            presets: ['@babel/env']
        }))
        .on('error', showError)
        .pipe(uglify())
        .on('error', showError)
        .pipe(gulp.dest('./dist/routes'))
        //自动刷新
        .pipe(connect.reload());
})
//监听任务
gulp.task("watch", function () {
    gulp.watch("./src/*.html", ["htmlmin"]);
    gulp.watch("./src/common/*.html", ["htmlmin"]);
    gulp.watch("./src/css/*.css", ["cssmin"]);
    gulp.watch("./src/css/*.scss", ["cssmin"]);
    gulp.watch("./src/js/*.js", ["jsmin"]);
    gulp.watch("./src/*.js", ["jsmin-node"]);
    gulp.watch("./src/routes/*.js", ["jsmin-routes"]);
    gulp.watch("./src/img/*", ["images"]);
})
gulp.task("build", ['htmlmin', 'cssmin', 'jsmin', 'jsmin-node', 'jsmin-routes','img', 'watch', "server"])