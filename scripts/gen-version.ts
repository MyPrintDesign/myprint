import { writeFile } from 'fs/promises';
import path, { resolve } from 'path';
import consola from 'consola';
//@ts-ignore
import pkg from '../packages/design/package.json';

export const projRoot = resolve(__dirname, '..');
export const pkgRoot = resolve(projRoot, 'packages');
export const epRoot = resolve(pkgRoot, 'design', 'src');

function getVersion() {
    const tagVer = process.env.TAG_VERSION;
    if (tagVer) {
        return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer;
    } else {
        return pkg.version;
    }
}

const version = getVersion();

async function main() {
    consola.info(`Version: ${version}`);
    await writeFile(
        path.resolve(epRoot, 'version.ts'),
        `export const version = '${version}'\n`
    );
}

main();
