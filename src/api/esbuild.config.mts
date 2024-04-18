import * as esbuild from "esbuild";
import eslint from "esbuild-plugin-eslint";
import esbuildPluginTsc from "esbuild-plugin-tsc";
import { rimrafSync } from "rimraf";

const commandLine: string[] = process.argv.slice(2);

if (commandLine.length === 0) {
    console.error("Please provide an argument!");
} else if (commandLine[0] === "build") {
    rimrafSync("../../dist/api");

    const settings: esbuild.BuildOptions = {
        entryPoints: ["./src/index.ts"],
        outfile: "../../dist/api/index.js",
        bundle: true,
        external: [
            "@nestjs/microservices",
            "@nestjs/websockets/socket-module",
            "class-transformer/storage",
        ],
        loader: {
            ".html": "file",
        },
        minify: true,
        sourcemap: "external",
        platform: "node",
        target: "node18",
        plugins: [
            eslint({
                throwOnError: true,
            }),
            esbuildPluginTsc({
                tsconfigPath: "./tsconfig.json",
            }),
        ],
    };

    await esbuild.build(settings);
}
