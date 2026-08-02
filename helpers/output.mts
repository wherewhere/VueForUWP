/// <reference types="node" />
import type { CodeSplittingOptions, OutputOptions } from "rolldown";
import { extname } from "path";
import Mime from "mime";

function getType(path: string[]) {
    if (path.length) {
        const type = Mime.getType(extname(path[0]).toLowerCase());
        if (type) {
            const list = type.split('/');
            return list[0] === "text" ? list[1] : list[0];
        }
    }
}

export default function getOutputOptions(codeSplitting?: boolean | CodeSplittingOptions): OutputOptions {
    return {
        assetFileNames: chunkInfo => {
            const type = getType(chunkInfo.names);
            switch (type) {
                case "javascript":
                    return "assets/js/[name]-[hash].[ext]";
                default:
                    return type ? `assets/${type}/[name]-[hash].[ext]` : "assets/[name]-[hash].[ext]";
            }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        codeSplitting
    };
}