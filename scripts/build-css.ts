import path from 'path'
import chalk from 'chalk'
// @ts-ignore
import {dest, parallel, series, src} from 'gulp'
import gulpSass from 'gulp-sass'
import * as dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import consola from 'consola'
import {resolvePackagePath} from './util';
import fs from "node:fs";

const pkgDirName = 'design'

const distFolder = resolvePackagePath(pkgDirName, 'dist', 'css', 'styles')
const distBundle = resolvePackagePath(pkgDirName, 'dist')
// console.log(distFolder)
// console.log(distBundle)

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  const noElPrefixFile = /(index|base|display)/
  return src(resolvePackagePath(pkgDirName, 'src/styles/*.scss'))
      .pipe(sass.sync())
      .pipe(autoprefixer({cascade: false}))
      .pipe(
          cleanCSS({}, (details) => {
            consola.success(
                `${chalk.cyan(details.name)}: ${chalk.yellow(
                    details.stats.originalSize / 1000
                )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
            )
          })
      )
      .pipe(
          rename((path) => {
            // if (!noElPrefixFile.test(path.basename)) {
            //   path.basename = `el-${path.basename}`
            // }
          })
      )
      .pipe(dest(distFolder))
}

/**
 * Build dark Css Vars
 * @returns
 */
function buildDarkCssVars() {
  const sass = gulpSass(dartSass)
  return src(path.resolve(__dirname, 'src/dark/css-vars.scss'))
      .pipe(sass.sync())
      .pipe(autoprefixer({cascade: false}))
      .pipe(
          cleanCSS({}, (details) => {
            // consola.success(
            //     `${chalk.cyan(details.name)}: ${chalk.yellow(
            //         details.stats.originalSize / 1000
            //     )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
            // )
          })
      )
      .pipe(dest(`${distFolder}/dark`))
}

/**
 * copy from packages/theme-chalk/dist to dist/element-plus/theme-chalk
 */
export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */

export function copyThemeChalkSource() {
  // console.log(resolvePackagePath(pkgDirName, 'src/assets/fonts/**'))
  return src(resolvePackagePath(pkgDirName, 'src/assets/fonts/**')).pipe(
      dest(resolvePackagePath(pkgDirName, 'dist/css/assets/fonts'))
  )
}

export const build = parallel(
    copyThemeChalkSource,
    series(buildThemeChalk)
)

await build()

// setTimeout(()=>{
//     const pkgDistPath = resolvePackagePath(pkgDirName, 'dist');
//     if (fs.existsSync(pkgDistPath) && fs.statSync(pkgDistPath).isDirectory()) {
//         fs.rmSync(pkgDistPath, {recursive: true});
//     }
// }, 1000)


