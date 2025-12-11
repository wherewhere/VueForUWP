import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import simpleHtmlPlugin from "vite-plugin-simple-html";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
    base: "./",
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: tag => tag.includes('-')
                }
            }
        }),
        simpleHtmlPlugin({
            minify: {
                minifyJs: true,
                sortSpaceSeparatedAttributeValues: true,
                sortAttributes: true,
                tagOmission: false
            }
        }),
        legacy({
            targets: "Edge >= 13",
            polyfills: true,
            renderModernChunks: false
        })
    ],
    css: {
        devSourcemap: true
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        minify: "terser"
    }
});