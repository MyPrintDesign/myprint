import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@myprint/design': fileURLToPath(new URL('../design/src', import.meta.url))
        }
    }
});
