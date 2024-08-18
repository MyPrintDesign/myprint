import path, { resolve } from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { OutputOptions, rollup, RollupBuild } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import vue from '@vitejs/plugin-vue';
import VueMacros from 'unplugin-vue-macros/rollup';
import vueJsx from '@vitejs/plugin-vue-jsx';
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild';
import { parallel } from 'gulp';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import glob from 'fast-glob';
import replace from '@rollup/plugin-replace';
import { camelCase, upperFirst } from 'lodash';
// import {
//   PKG_BRAND_NAME,
//   PKG_CAMELCASE_LOCAL_NAME,
//   PKG_CAMELCASE_NAME,
// } from '@element-plus/build-constants'
// import { epOutput, epRoot, localeRoot } from '@element-plus/build-utils'
// import { version } from '../../../../packages/element-plus/version'
// import { ElementPlusAlias } from '../plugins/element-plus-alias'
// import {
//   formatBundleFilename,
//   generateExternal,
//   withTaskName,
//   writeBundles,
// } from '../utils'
// import { target } from '../build-info'
import type { Plugin } from 'rollup';

export const target = 'es2018';

// import type { ProjectManifest } from '@pnpm/types'
const epOutput = '/Users/css/code/webstorm/self/myprint/myprint/packages/design/dist/myprint-design';
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
    Object.assign(fn, { displayName: name });


export const getPackageManifest = (pkgPath: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(pkgPath) as ProjectManifest;
};

export const getPackageDependencies = (
    pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
    const manifest = getPackageManifest(pkgPath);
    const { dependencies = {}, peerDependencies = {} } = manifest;

    return {
        dependencies: Object.keys(dependencies),
        peerDependencies: Object.keys(peerDependencies)
    };
};


export const generateExternal = async (options: { full: boolean }) => {
    const { dependencies, peerDependencies } = getPackageDependencies(epPackage);

    return (id: string) => {
        const packages: string[] = [...peerDependencies];
        if (!options.full) {
            packages.push('@vue', ...dependencies);
        }

        if (id.endsWith('.scss') || id.endsWith('.ttf') || id.endsWith('.woff2') || id.endsWith('.svg')
            || id.endsWith('.css')
            || id.endsWith('.png')
        ) {
            return true;
        }

        const ss =  [...new Set(packages)].some(
            (pkg) => id === pkg || id.startsWith(`${pkg}/`)
        )
        // if(ss){
        //     console.log('sss', id);
        // }
        return ss;
    };
};

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
    return Promise.all(options.map((option) => bundle.write(option)));
}

export function formatBundleFilename(
    name: string,
    minify: boolean,
    ext: string
) {
    return `${name}${minify ? '.min' : ''}.${ext}`;
}


// export function ElementPlusAlias(): Plugin {
//     const themeChalk = 'theme-chalk';
//     const sourceThemeChalk = `${PKG_PREFIX}/${themeChalk}` as const;
//     const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const;
//
//     return {
//         name: 'element-plus-alias-plugin',
//         resolveId(id) {
//             if (!id.startsWith(sourceThemeChalk)) return;
//             return {
//                 id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
//                 external: 'absolute'
//             };
//         }
//     };
// }


export const projRoot = resolve(__dirname, '..');
export const pkgRoot = resolve(projRoot, 'packages');
// export const localeRoot = resolve(pkgRoot, 'locale');
export const epRoot = resolve(pkgRoot, 'design', 'src');
export const epPackage = resolve(pkgRoot, 'design', 'package.json');


// export const PKG_PREFIX = '@element-plus';
// export const PKG_NAME = 'element-plus';
export const PKG_CAMELCASE_NAME = 'MyPrinterDesign';
// export const PKG_CAMELCASE_LOCAL_NAME = 'ElementPlusLocale';
// export const PKG_BRAND_NAME = 'Element Plus';

async function buildFullEntry(minify: boolean) {
    const plugins: Plugin[] = [
        // ElementPlusAlias(),
        VueMacros({
            setupComponent: false,
            setupSFC: false,
            plugins: {
                vue: vue({
                    isProduction: true
                }),
                vueJsx: vueJsx(),
            }
        }),
        nodeResolve({
            extensions: ['.mjs', '.js', '.json', '.ts']
        }),
        //@ts-ignore
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true,
        }),
        commonjs(),
        esbuild({
            exclude: [],
            sourceMap: minify,
            target,
            loaders: {
                '.vue': 'ts',
            },
            define: {
                'process.env.NODE_ENV': JSON.stringify('production')
            },
            treeShaking: true,
            legalComments: 'eof'
        }),
        //@ts-ignore
        nodePolyfills(),

    ];
    if (minify) {
        plugins.push(
            minifyPlugin({
                target,
                sourceMap: true
            })
        );
    }

    // console.log(111);
    // console.log(await generateExternal({full:true}));
    // console.log(222);
    // console.log(path.resolve(epRoot, 'index.ts'));
    const bundle = await rollup({
        input: path.resolve(epRoot, 'index.ts'),
        plugins,
        inlineDynamicImports: true, // 内联动态引入
        external: await generateExternal({ full: true }),
        treeshake: true
    });
    await writeBundles(bundle, [
        {
            format: 'umd',
            file: path.resolve(
                epOutput,
                'dist',
                formatBundleFilename('index.full', minify, 'js')
            ),
            exports: 'named',
            name: PKG_CAMELCASE_NAME,
            globals: {
                vue: 'Vue'
            },
            sourcemap: minify,
            // banner,
        },
        {
            format: 'esm',
            file: path.resolve(
                epOutput,
                'dist',
                formatBundleFilename('index.full', minify, 'mjs')
            ),
            sourcemap: minify
            // banner,
        }
    ]);
}

// async function buildFullLocale(minify: boolean) {
//   const files = await glob(`**/*.ts`, {
//     cwd: path.resolve(localeRoot, 'lang'),
//     absolute: true,
//   })
//   return Promise.all(
//     files.map(async (file) => {
//       const filename = path.basename(file, '.ts')
//       const name = upperFirst(camelCase(filename))
//
//       const bundle = await rollup({
//         input: file,
//         plugins: [
//           esbuild({
//             minify,
//             sourceMap: minify,
//             target,
//           }),
//         ],
//       })
//       await writeBundles(bundle, [
//         {
//           format: 'umd',
//           file: path.resolve(
//             epOutput,
//             'dist/locale',
//             formatBundleFilename(filename, minify, 'js')
//           ),
//           exports: 'default',
//           name: `${PKG_CAMELCASE_LOCAL_NAME}${name}`,
//           sourcemap: minify,
//           // banner,
//         },
//         {
//           format: 'esm',
//           file: path.resolve(
//             epOutput,
//             'dist/locale',
//             formatBundleFilename(filename, minify, 'mjs')
//           ),
//           sourcemap: minify,
//           // banner,
//         },
//       ])
//     })
//   )
// }

export const buildFull = (minify: boolean) => async () =>
    Promise.all([buildFullEntry(minify)
        // , buildFullLocale(minify)
    ]);

await buildFullEntry(false);
export const buildFullBundle = parallel(
    withTaskName('buildFullMinified', buildFull(true)),
    withTaskName('buildFull', buildFull(false))
);
