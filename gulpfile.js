const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

/**
 * TOP LEVEL FUNCTIONS
 * gulp.task - Define tasks
 * gulp.src - Point tofiles to use
 * gulp.dest - Points to folder to output
 * gulp.watch - Watch files and folder for changes
 */

// Logs Message
gulp.task('message', async () => console.log('Gulp is running...'));

// Copy All HTML files
gulp.task('copyHtml', async () => {
	gulp.src('src/*.html')
		.pipe(gulp.dest('dist'));
})

// Optimize Images
gulp.task('imageMin', async () =>
	gulp.src('src/assets/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/images'))
);

//scripts js
gulp.task('scripts', () =>
	//gulp.src('src/assets/js/*.js')
	gulp.src(['src/assets/js/main.js', 'src/assets/js/admin.js'])
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dist/assets/js'))
);

// compile sasss
gulp.task('sass', () =>
	gulp.src('src/assets/sass/app.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('dist/assets/css'))
);


gulp.task('default', gulp.series('message', 'copyHtml', 'imageMin', 'scripts', 'sass'));

gulp.task('watch', () => {
	gulp.watch('src/assets/js/*.js', gulp.series('scripts'));
	gulp.watch('src/assets/images/*', gulp.series('imageMin'));
	gulp.watch('src/assets/sass/*.scss', gulp.series('sass'));
	gulp.watch('src/*.html', gulp.series('copyHtml'));
})