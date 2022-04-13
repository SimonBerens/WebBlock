import {resolve} from "path";
import {defineConfig} from "vite";


module.exports = defineConfig({
    root: './src',
    build: {
        target: 'es2019',
        outDir: '../dist',
        emptyOutDir: true,
        assetsDir: '.',

        rollupOptions: {
            input: {
                background: resolve(__dirname, 'src', 'background.ts'),
                blocked: resolve(__dirname, 'src', 'blocked.html'),
                options: resolve(__dirname, 'src', 'options.html'),
                popup: resolve(__dirname, 'src', 'popup.html'),
                suggested: resolve(__dirname, 'src', 'suggested.html'),
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            }
        }
    }
})