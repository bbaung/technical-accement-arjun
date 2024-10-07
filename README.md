## Introduction
This project aim to simplify the HTML development through `gulp`. 

### Get Started
1. Fork this responsitory to create another respository
2. Git clone the forked respository 
3. Run `npm run dev`

### Notes
- Don't push directly to **this theme responsitory**
- There must't any hardcoded text & files in slices, must use [`@@variable_name;`](https://www.npmjs.com/package/gulp-file-include#include-options---type-json) for text and `@@public('file_name');` to load the files
- Alpine JS
  - Use Gulp Render (SSR) (eg. `@@for`) over Alpine Render (CSR) (eg. `x-for`)
  - Use `Alpine.data` over Alpine attributes `x-data` 

### Tasks
- [x] `Initial Setup`
- [x] `@@beforescripts;` to load `/js/before.js`
- [x]  `@@public('file_name');` to get the files from `public` folder.
- [ ]  `@@scripts;` to load `/js/script.js`
- [ ]  `@@styles;` to load `/css/styles.js`
- [ ] `@@include('common/seo');` for resuable HTML templates
- [ ]  Testing for HTML Slices (Sementic, Accessibilities)
- [ ] Image Optimziation 
- [ ] Setup CI CD
- [ ] Setup CLI
- [ ] Setup Docs
- [ ] add build:wp gulp task to generate the wordpress

## Technlogies

### Libraries

- AlpineJS: 3.14.1
    - Morph Plugin: 3.14.1
- Tailwind CSS: 3.4.13
- Swiper: 11.1.14

### Javascript 
- ES6+
- **Known Issue:** can't import `.mjs` directly into script. Won't fix.

### CSS
- `@import` directive to import the css files 
- Nesting 
- Auto Prefixer for different browsers




## NPM Scripts

| Script             | Description          |
| ------------------ | -------------------- |
| dev                | Runs the project in development mode, releasing it under the `dist` folder and launching BrowserSync on a specified `PORT`. |
| build              | Builds the project for release under the `build` folder, and this version is intended for uploading to the server. |

## Folder Structure 


| Folder Path          | Description          |
| ------------------ | -------------------- |
| utils              | Contains utility files for Gulp configuration.|
| src/pages          | Create HTML pages in this folder. Any HTML placed here will be generated in the build or dist folder. Reuse slices—do not write body html code directly here. Use `@@include` to import slices. |
| src/public         | Store assets such as images, favicons, robots.txt|
| src/scripts/main   | Scripts in this folder will be combined into `/js/script.js`. Use this folder for app-wide scripts. Do not include section-specific scripts here.|
| src/scripts/before | Scripts in this folder will be combined into `/js/before.js`. Use this folder for app-wide scripts. Do not include section-specific scripts here.|
| src/slices         | Contains sections for all pages. You can create and use CSS and JS for individual sections directly within this folder.  |
| src/styles         | Styles in this folder will be combined into `css/style.css`. Use this folder for global styles. Do not include section-specific styles here. |

## Template Strings

| Variables        | Description          |
| ---------------- | -------------------- |
| @@beforescript;  | Load `/js/before.js` |

The other template strings are processed using [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) with the updated prefix `@@` and suffix `;` and **@@include base file** path start from src. 