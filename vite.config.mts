import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import markdown from "unplugin-vue-markdown/vite";
import simpleHtmlPlugin from "vite-plugin-simple-html";
import legacy from "@vitejs/plugin-legacy";
import postcssPresetEnv from "postcss-preset-env";

export default defineConfig({
    base: "./",
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
            template: {
                compilerOptions: {
                    isCustomElement: tag => tag.includes('-')
                }
            }
        }),
        markdown({}),
        simpleHtmlPlugin({
            minify: {
                minifyJs: true,
                sortSpaceSeparatedAttributeValues: true,
                sortAttributes: true,
                tagOmission: false
            }
        }),
        legacy({
            targets: "Edge >= 18",
            polyfills: true,
            renderModernChunks: false
        })
    ],
    css: {
        postcss: {
            plugins: [
                postcssPresetEnv({
                    stage: 0,
                    browsers: "Edge >= 18"
                })
            ]
        },
        devSourcemap: true
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        minify: "terser"
    }
});