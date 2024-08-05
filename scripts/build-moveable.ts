/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs';
import { rollup } from 'rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import type { Alias } from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import glob from 'fast-glob';
import type { OutputOptions } from 'rollup';
import { resolvePackagePath } from './util';
import path from 'path';
// import typescript from 'rollup-plugin-typescript2'

const overrides = {
    compilerOptions: { declaration: false }, // 是否创建 typescript 声明文件
    exclude: [
        // 排除项
        'node_modules',
        'src/App.vue',
        'src/main.ts'
    ]
};

const getExternal = async (pkgDirName: string) => {
    const pkgPath = resolvePackagePath(pkgDirName, 'package.json');
    const manifest = require(pkgPath) as any;
    const {
        dependencies = {},
        peerDependencies = {},
        devDependencies = {}
    } = manifest;
    const deps: string[] = [
        ...new Set([
            ...Object.keys(dependencies),
            ...Object.keys(peerDependencies),
            ...Object.keys(devDependencies)
        ])
    ];
    return (id: string) => {
        if (id.endsWith('.scss') || id.endsWith('.ttf') || id.endsWith('.woff2') || id.endsWith('.svg')
            || id.endsWith('.css')
            || id.endsWith('.png')
        ) {
            return true;
        }
        return deps.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));
    };
};

const build = async (pkgDirName: string) => {
    const pkgDistPath = resolvePackagePath(pkgDirName, 'dist');
    if (fs.existsSync(pkgDistPath) && fs.statSync(pkgDistPath).isDirectory()) {
        fs.rmSync(pkgDistPath, { recursive: true });
    }

    const input = await glob(['**/moveable_local.ts', '!node_modules'], {
        cwd: resolvePackagePath(pkgDirName, 'src'),
        absolute: true,
        onlyFiles: true
    });

    const bundle = await rollup({
        input,
        plugins: [
            VueMacros({
                setupComponent: false,
                setupSFC: false,
                plugins: {
                    vue: vue({
                        isProduction: true,
                        reactivityTransform: true
                    }),
                    vueJsx: vueJsx()
                }
            }),
            nodeResolve({
                extensions: ['.mjs', '.js', '.json', '.ts']
            }),
            alias({
                entries: [{
                    find: '@myprint/design',
                    // customResolver: nodeResolve({
                    //     extensions: ['.mjs', '.vue', '.js', '.json', '.ts']
                    // }),
                    replacement: path.resolve(__dirname, resolvePackagePath(pkgDirName, './src'))
                } as Alias]
            }),
            // typescript({ tsconfigOverride: overrides }),
            commonjs(),
            // babel({
            //     exclude: 'node_modules/**', // 指定哪些文件夹时不进行babel编译的
            // }),
            esbuild({
                sourceMap: true,
                target: 'es2021',
                loaders: {
                    '.vue': 'ts'
                }
            })
        ],
        external: await getExternal(pkgDirName),
        treeshake: false
    });

    const options: OutputOptions[] = [
        {
            format: 'esm',
            dir: resolvePackagePath(pkgDirName, 'moveable-dist'),
            exports: undefined,
            preserveModules: true,
            preserveModulesRoot: resolvePackagePath(pkgDirName, 'src'),
            sourcemap: false,
            entryFileNames: '[name].mjs'
        }
    ];
    return Promise.all(options.map((option) => bundle.write(option)));
};

console.log('[TS] 开始编译moveable···');
await build('design');
// 处理文件
let content = fs.readFileSync(resolvePackagePath('design', 'moveable-dist', 'plugins', 'moveable', 'moveable_local.mjs'), { encoding: 'utf8' });

const regex = new RegExp('.mjs', 'g');
content = content.replace(regex, '');
content = content.replace('//# sourceMappingURL=moveable_local.map', '');
// console.log(content);
//更改内容
fs.writeFileSync(resolvePackagePath('design', 'src', 'plugins', 'moveable', 'moveable_js.js'), content);

const pkgDistPath = resolvePackagePath('design', 'moveable-dist');
if (fs.existsSync(pkgDistPath) && fs.statSync(pkgDistPath).isDirectory()) {
    fs.rmSync(pkgDistPath, { recursive: true });
}

// await build('business');
console.log('[TS] 开始编译moveable成功！');
