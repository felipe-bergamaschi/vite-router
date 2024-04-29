import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// @ts-ignore
// import { ViteRouter } from "../src";
import { ViteRouter } from "vite-plugin-router";

export default defineConfig({
	plugins: [react(), ViteRouter()],
});
