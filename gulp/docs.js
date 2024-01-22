const gulp = require('gulp');
//HTML
const fileInclude = require('gulp-file-include');
const htmlclean =require('gulp-htmlclean');
//Sass
const sass = require('gulp-sass')(require('sass'));
const webpHTML = require("gulp-htmlclean");
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const csso=require('gulp-csso');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const webpCss =require('gulp-webp-css');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
//Images
const imagemin = require('gulp-imagemin');
const webp =require('gulp-webp')
const changed = require('gulp-changed');
// const { group } = require('console');
gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false })
            .pipe(clean({ force: true }));
    }
    done();
});

gulp.task('html:docs',function(){
    return gulp
    .src(['./src/html/**/*.html','!./src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(webpHTML())
    .pipe(fileInclude({
        prefix:'@@',
        basepath:'@file'

       
    }))
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
    });
    
const plumberNotify = (title) =>{
    return{
    errorHandler : notify.onError({
        title : 'title',
        message :"Error <%= error.message %>",
        sound : false
    })  
}
};


gulp.task('sass:docs', function(){
    return ( 
        gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(sass())
    .pipe(csso())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./docs/css/'))
    );
});

gulp.task('images:docs',function(){
    return gulp.src('./src/img/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(gulp.dest('./docs/img/'))
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./docs/img/'));
    
});

gulp.task('fonts:docs',function(){
    return gulp.src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'))
    
});
gulp.task('files:docs',function(){
    return gulp.src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'))
});

gulp.task('js:docs',function(){
    return gulp.src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    //.pipe(babel())
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./docs/js'))
});

const serverOptions = {
    livereload: true,
    open: true,
    host: '192.168.1.133'  
};
gulp.task('server:docs',function(){
    return gulp.src('./docs/').pipe(server(serverOptions));
});





