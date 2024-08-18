import fs from 'node:fs';
import { resolvePackagePath } from './util';

export function readFile(pkgPath: string) {
    return fs.readFileSync(pkgPath, { encoding: 'utf8' });
}

export function writeFileSync(pkgPath: string, content:string) {
    fs.writeFileSync(pkgPath, content);
}
