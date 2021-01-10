const gulp = require('gulp');
const { src, dest, watch, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const cssnano = require('cssnano');
const autoprefix = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

const jsPath = 'src/assets/js/*.js';
const sassPath = 'src/assets/sass/*.scss';

/**
 * TOP LEVEL FUNCTIONS
 * gulp.task - Define tasks
 * gulp.src - Point tofiles to use
 * gulp.dest - Points to folder to output
 * gulp.watch - Watch files and folder for changes
 */

// Logs Message
gulp.task('message', async () => console.log('Gulp is running...'));

async function copyHtml() {
	src('src/*.html').pipe(dest('dist'));
}

// Optimize Images
async function imageMin() {
	src('src/assets/images/*')
		.pipe(imagemin())
		.pipe(dest('dist/assets/images'))
}


//scripts js
async function scripts(){
	src(['src/assets/js/main.js', 'src/assets/js/admin.js'])
	.pipe(sourcemaps.init())
	.pipe(terser())
	.pipe(concat('app.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('dist/assets/js'));
}


// compile sasss
async function compileSass(){
	src('src/assets/sass/app.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(postcss([autoprefix(),cssnano()]))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('dist/assets/css'))
}

function watchTask(){
	watch([sassPath,jsPath], {interval: 1000}, parallel(compileSass,scripts))
}

// gulp.task('default', gulp.series('message', 'copyHtml', 'imageMin', 'scripts', 'sass'));

// gulp.task('watch', () => {
// 	gulp.watch('src/assets/js/*.js', gulp.series('scripts'));
// 	gulp.watch('src/assets/images/*', gulp.series('imageMin'));
// 	gulp.watch('src/assets/sass/*.scss', gulp.series('sass'));
// 	gulp.watch('src/*.html', gulp.series('copyHtml'));
// })

exports.sass = compileSass;
exports.scripts = scripts;
exports.html = copyHtml;
exports.images = imagemin;
exports.build = parallel(copyHtml,imageMin,scripts,compileSass);
exports.default = series(
	parallel(copyHtml,imageMin,scripts,compileSass),
	watchTask
);