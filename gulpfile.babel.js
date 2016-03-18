import gulp from 'gulp'
import cleanCSS from 'gulp-clean-css'
import htmlmin from 'gulp-htmlmin'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import rimraf from 'gulp-rimraf'
import runSequence from 'run-sequence'
import { server as electronConnect } from 'electron-connect'

/* setup electron connect server for live reloading */
const electronDev = electronConnect.create({ path: 'build' })



/* Build Tasks */

gulp.task('build-core', () => {
    gulp.src('src/main/*.js')
        .pipe(babel())
        .pipe(concat('core.js'))
        .pipe(gulp.dest('build/js'))
    return gulp.src('src/main/workers/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build/js/workers'))
})

gulp.task('build-render', () => gulp.src('src/render/**/*.js').pipe(babel()).pipe(concat('render.js')).pipe(gulp.dest('build/js')))

gulp.task('build-styles', () => {
    gulp.src('src/styles/app/**/*.css')
        .pipe(cleanCSS())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('build/css'))

    return gulp.src('src/styles/vender/**/*.css')
        .pipe(cleanCSS())
        .pipe(concat('vender.css'))
        .pipe(gulp.dest('build/css'))
})

gulp.task('build-static-assets', () => {
    gulp.src(['package.json', 'LICENSE']).pipe(gulp.dest('build'))
    gulp.src('src/main/app.html').pipe(htmlmin({ collapseWhitespace: true })).pipe(gulp.dest('build'))
    return gulp.src('src/images/**/*').pipe(gulp.dest('build/images'))
})

gulp.task('clean-build', () => gulp.src('build', { read: false }).pipe(rimraf()))



/* Watch Tasks */

gulp.task('watch-core', () => gulp.watch('src/main/**/*.js', ['build-core', callback => electronDev.restart(['--dev'], callback)]))

gulp.task('watch-render', () => gulp.watch('src/render/**/*.js', ['build-render', electronDev.reload]))

gulp.task('watch-styles', () => gulp.watch('src/styles/**/*.css', ['build-styles', electronDev.reload]))

gulp.task('watch-static-assets', () => gulp.watch(['package.json', 'src/main/app.html, src/images/**/*'], ['build-static-assets', electronDev.reload]))



/* npm tasks */

gulp.task('start', callback => runSequence('clean-build', ['build-core', 'build-render', 'build-styles', 'build-static-assets'], 'electron-start', callback))

gulp.task('start-dev', callback => runSequence('clean-build', ['build-core', 'build-render', 'build-styles', 'build-static-assets'], ['watch-core', 'watch-render', 'watch-styles', 'watch-static-assets'], 'electron-start-dev', callback))



/* Electron Tasks */

gulp.task('electron-start', electronDev.start)

gulp.task('electron-start-dev', callback => electronDev.start(['--dev'], callback))
