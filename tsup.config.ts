import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"], // Entry point of your library
	format: ["cjs", "esm"], // Generate CommonJS and ESModule formats
	dts: true, // Generate declaration files
	splitting: false,
	sourcemap: true,
	clean: true, // Clean the dist folder before each build
	external: ["react", "react-dom"],
})
