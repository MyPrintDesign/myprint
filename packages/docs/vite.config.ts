import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@myprint/design': fileURLToPath(new URL('../design/src', import.meta.url))
        }
    }
});
