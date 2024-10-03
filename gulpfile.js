const gulp = require('gulp')
const { series, parallel, src, dest, watch } = gulp
const concat = require('gulp-concat')
const fs = require('fs').promises;
const browserSync = require("browser-sync");

// HTML Related
const fileInclude = require('gulp-file-include');

// CSS Related
const postcss = require('gulp-postcss')
const postcssImport = require('postcss-import')
const minifyCss = require('gulp-clean-css')
const tailwindcss = require("tailwindcss");
const tailwindNesting = require('@tailwindcss/nesting')
const tailwindConfig = require("./tailwind.config.js");
const autoprefixer = require('autoprefixer')

// JS Related
const terser = require('gulp-terser');

// Configs
const config = require('./config.json')
const isProduction = process.env.NODE_ENV === 'production'
const filePath =  isProduction ? config.output.build : config.output.dist
const PORT = config.app.port

// Utils
const logger = require("./src/utils/logger");
const sitemap = require('gulp-sitemap')

async function cleanUp() {
    logger.info(`Cleaning up ${filePath} for fresh start`)

    try {
        return await fs.rmdir(filePath, { force: true, recursive: true });   
    } catch (e) {
        if (e.code === "ENOENT") {
            // If the file not exist, return true
            return true
        } 
        throw e
    }   
}

function prepareHTML() {
    logger.info(`Preparing HTML`)

    return src([
        'src/pages/**/*.html',
    ])
    .pipe(fileInclude({
        prefix: "@@",
        suffix: ';',
        basepath: "./src"
    }))
    .pipe(dest(filePath))
}

function prepareStyles() {
    logger.info(`Preparingg CSS`)

    return src([
        'src/styles/*.css',
        'src/slices/**/*.css'
    ])
    .pipe(
        postcss(
            [
                postcssImport(), 
                tailwindNesting(),
                tailwindcss(tailwindConfig),     
                autoprefixer()           
            ]
        )
    )
    .pipe(minifyCss({ compatibility: "ie8" }))
    .pipe(concat({ path: "style.css" }))
    .pipe(dest(filePath))
}

function prepareScripts(done) {
    logger.info(`Preparing Javascript`)

    return src([
        'src/scripts/*.js',
        'src/slices/**/*.js'
    ])
    .pipe(concat({ path: "script.js" }))   
    .pipe(terser())
    .pipe(dest(filePath))
}

function prepareFiles(done) {
    logger.info(`Preparing Files`)

    return src('./src/public/**/*').pipe(dest(`${filePath}/public`))
}

function livePreview(done) {
    // No need to watch at production
    if (isProduction) return done()
  
    
    logger.info(`Preview available at ${PORT}`)

    browserSync.init({
      server: {
        baseDir: filePath
      },
      notify: false,
      port: PORT
    });
    done();
}  

// Triggers Browser reload
function previewReload(done) {
    logger.log("Reloading Browser Preview.");
    browserSync.reload();
    done();
}  

function watchFiles(done) {
    // No need to watch at production
    if (isProduction) return done()

    watch(
        [`src/pages/**/*.html`, `src/slices/**/**/*.html`],
        series(prepareHTML, prepareStyles, previewReload)
    );
    watch(
        ["./tailwind.config.js", `src/styles/**/*.css`, `src/slices/**/**/*.css`],
        series(prepareStyles, previewReload)
    );
    watch(
        `src/slices/**/*.js`,
        series(prepareScripts, previewReload)
    );
    watch(`src/public/**/*`, series(prepareFiles, previewReload));

    logger.log( "Watching for Changes..");
}

function generateSiteMap(done) {
    if (!isProduction) return done()

    return src(['build/**/*.html'], {
        read: false 
    })
    .pipe(sitemap({
        siteUrl: config.sitemap.url
    }))
    .pipe(dest(
        `${filePath}`
    ))
}

gulp.task('default',
    series(
        cleanUp.bind({ filePath: config.output.dist }),
        parallel(prepareHTML, prepareStyles, prepareScripts, prepareFiles),
        livePreview, 
        watchFiles,
        generateSiteMap
    )
)