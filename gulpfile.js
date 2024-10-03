const gulp = require('gulp')
const { series, parallel, src, dest, watch } = gulp
const concat = require('gulp-concat')
const fs = require('fs').promises;
const browserSync = require("browser-sync");
const map = require('map-stream')
const buffer = require('gulp-buffer')

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
const browserify = require('browserify');

// Configs
const config = require('./config.json')
const isProduction = process.env.NODE_ENV === 'production'
const filePath =  isProduction ? config.output.build : config.output.dist
const PORT = config.app.port

// Utils
const logger = require("./utils/logger");
const sitemap = require('gulp-sitemap')
const templateStringReplacer = require('./utils/templateStringReplacer.js');

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
    .pipe(map(function(file, done) {
        const fileContent = file.contents.toString() 

        const newFileContent = templateStringReplacer(fileContent)

        file.contents = Buffer.from(newFileContent);

        done(false, file)
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
    .pipe(dest(`${filePath}/css`))
}

function prepareBeforeScripts(done) {
    logger.info(`Preparing for Head Javascript`)

    return src([
        'src/scripts/before/**/*.js',        
    ])
    .pipe(
        map(function(file, done) {            
            const newFileContent = browserify(file.path, {debug: true })
            .transform('babelify', {
                presets: ["@babel/preset-env"]
            })
            .bundle();
            file.contents = newFileContent
            done(false, file)
        })
    )
    .pipe(buffer())    
    .pipe(terser())
    .pipe(concat({ path: 'before.js' }))    
    .pipe(dest(`${filePath}/js/`))
}

function prepareScripts(done) {
    logger.info(`Preparing Javascript`)

    return src([
        'src/scripts/main/**/*.js',
        'src/slices/**/*.js'
    ])
    .pipe(
        map(function(file, done) {            
            const newFileContent = browserify(file.path, {debug: true })
            .transform('babelify', {
                presets: ["@babel/preset-env"]
            })
            .bundle();
            file.contents = newFileContent
            done(false, file)
        })
    )
    .pipe(buffer())
    .pipe(concat({ path: 'script.js' }))    
    .pipe(terser())
    .pipe(dest(`${filePath}/js/`))
}

function prepareFiles(done) {
    logger.info(`Preparing Files`)

    return src('./src/public/**/*').pipe(dest(`${filePath}`))
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
        [`src/slices/**/*.js`, `src/scripts/main/**/*.js`],
        series(prepareScripts, previewReload)
    );
    watch(
        [`src/scripts/before/**/*.js`],
        series(prepareBeforeScripts, previewReload)
    )
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
        cleanUp, 
        parallel(prepareHTML, prepareStyles, prepareBeforeScripts, prepareScripts, prepareFiles),
        livePreview, 
        watchFiles,
        generateSiteMap
    )
)

// gulp.task('build:wp', 
//     series(
//         wpCleanUp,
//         generateBlocksJSON,
//         generateScripts,
//         generateStyles,
//         generateFiles,
//         generateDataBindCodes
//     )
// )