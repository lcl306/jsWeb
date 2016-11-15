var gulp = require('gulp');
var uglify = require('gulp-uglify');
var param = require('./param.json');

gulp.task('mini', function () {
    gulp.src([param.src-component-dir+'/**/*.js', param.src-routes-dir+'/**/*.js'])
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            //mangle: {except: ['require' ,'exports' ,'module' ,'$']},  //排除混淆关键字
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            //preserveComments: 'license' //all 保留所有注释
        }))
        .pipe(gulp.dest(param.dest-dir));
});