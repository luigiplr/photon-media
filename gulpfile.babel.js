import gulp from 'gulp'
import cleanCSS from 'gulp-clean-css'
import htmlmin from 'gulp-htmlmin'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import rimraf from 'gulp-rimraf'
import gutil from 'gulp-util'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import symlink from 'gulp-sym'
import gulpif from 'gulp-if'
import install from 'gulp-install'
import jeditor from 'gulp-json-editor'
import plumber from 'gulp-plumber'
import electronPackager from 'electron-packager'
import packageJson from './package.json'
import runSequence from 'run-sequence'
import { server as electronConnect } from 'electron-connect'

/* setup electron connect server for live reloading */
const electronDev = electronConnect.create({ path: 'build' })

const uglifyOptions = {
    options: {
        compress: {
            screw_ie8: true
        },
        mangle: {
            screw_ie8: true
        }
    }
}

let PRODUCTION_BUILD = true

/* Build Tasks */

gulp.task('build-core', () => {
    gulp.src('src/main/core.js')
        .pipe(plumber())
        .pipe(babel())
        .on('error', err => {
            gutil.log(gutil.colors.red('[Main Tread Code Compilation Error]'))
            gutil.log(gutil.colors.red(err.message))
        })
        .pipe(concat('core.js'))
        .pipe(uglify(uglifyOptions))
        .pipe(gulp.dest('build/js'))

    return gulp.src([
            'src/main/workers/workers.js',
            'src/main/workers/*.js'
        ])
        .pipe(concat('workers.js'))
        .pipe(plumber())
        .pipe(babel())
        .on('error', err => {
            gutil.log(gutil.colors.red('[Workers Code Compilation Error]'))
            gutil.log(gutil.colors.red(err.message))
        })
        .pipe(uglify(uglifyOptions))
        .pipe(gulp.dest('build/js'))
})

gulp.task('build-render', () => {
    return gulp.src('src/render/**/*.js')
        .pipe(concat('render.js'))
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(babel())
        .on('error', err => {
            gutil.log(gutil.colors.red('[Render Code Compilation Error]'))
            gutil.log(gutil.colors.red(err.message))
        })
        .pipe(uglify(uglifyOptions))
        .pipe(gulpif(!PRODUCTION_BUILD, sourcemaps.write()))
        .pipe(gulp.dest('build/js'))
})

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
    gulp.src('package.json').pipe(jeditor(json => {
        delete json.dependencies
        delete json.scripts
        delete json.devDependencies
        json.buildDate = new Date().toLocaleString()
        return json
    })).pipe(gulp.dest('build'))

    if (!PRODUCTION_BUILD)
        gulp.src('bower_components').pipe(symlink('build/bower_components', { force: true }))
    else
        gulp.src('bower_components/**/*').pipe(gulp.dest('build/bower_components'))

    gulp.src('LICENSE').pipe(gulp.dest('build'))
    gulp.src('src/main/**/*.html').pipe(htmlmin({ collapseWhitespace: true })).pipe(gulp.dest('build'))
    return gulp.src('src/images/**/*').pipe(gulp.dest('build/images'))
})

gulp.task('clean-build', () => gulp.src('build', { read: false }).pipe(rimraf()))



/* Watch Tasks */

gulp.task('watch-core', () => {
    gulp.watch('src/main/core.js', ['build-core', callback => electronDev.restart(['--dev'], callback)])
    return gulp.watch('src/main/workers/**/*.js', ['build-core', electronDev.reload])
})

gulp.task('watch-render', () => gulp.watch('src/render/**/*.js', ['build-render', electronDev.reload]))

gulp.task('watch-styles', () => gulp.watch('src/styles/**/*.css', ['build-styles', electronDev.reload]))

gulp.task('watch-static-assets', () => {
    gulp.watch('package.json', ['build-static-assets', electronDev.reload])
    return gulp.watch('src/main/app.html', ['build-static-assets', electronDev.reload])
})



/* npm tasks */

gulp.task('build', callback => runSequence('clean-build', ['build-core', 'build-render', 'build-styles', 'build-static-assets'], callback))

gulp.task('start', callback => runSequence('build', 'electron-start', callback))

gulp.task('start-dev', callback => {
    PRODUCTION_BUILD = false
    return runSequence('build', ['watch-core', 'watch-render', 'watch-styles', 'watch-static-assets'], 'electron-start-dev', callback)
})

gulp.task('release', callback => runSequence('build', 'electron-npm-deps', 'electron-build', callback))



/* Electron Tasks */

gulp.task('electron-start', electronDev.start)

gulp.task('electron-start-dev', callback => electronDev.start(['--dev'], callback))

gulp.task('electron-npm-deps', callback => gulp.src('package.json')
    .pipe(gulp.dest('build'))
    .pipe(install({ args: ['--production', '--no-optional'] })))

gulp.task('electron-build', callback => electronPackager({
    arch: 'ia32',
    dir: 'build',
    out: 'release',
    platform: 'win32',
    name: 'Photon Media',
    'build-version': packageJson.version,
    'app-version': packageJson.version,
    asar: true,
    cache: 'electron_cache',
    overwrite: true,
    version: '0.37.2'
}, (err, appPath) => {
    if (err) console.error(err)
    else console.info(`App built to ${appPath}`)
    callback()
}))


process.on('uncaughtException', console.error)

process.on('SIGINT', () => {
    electronDev.stop()
    process.exit(1)
})