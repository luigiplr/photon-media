import gulp from 'gulp'
import scss from 'gulp-scss'


gulp.task('scss', () => {
    gulp.src('src/render/**/*.scss')
        .pipe(scss({ bundleExec: true }))
        .pipe(gulp.dest('build/css/app.css'));
})

gulp.task('copy-assets', () => {
    gulp.src('src/main/app.html').pipe(gulp.dest('build/main/'))



})
