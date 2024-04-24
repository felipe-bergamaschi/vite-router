import fs from "node:fs/promises";
import path from "node:path";

import type { Route } from "./types";

export async function hooksGenerator(routes: Route[]) {
	const result: Record<string, null | Record<string, string>> = {};

	for (const route of routes) {
		if (
			route.params &&
			Array.isArray(route.params) &&
			route.params.length > 0
		) {
			const paramsObject: Record<string, string> = {};

			for (const param of route.params) {
				const paramName = param.replace(":", "");
				paramsObject[paramName] = "string";
			}

			result[route.route] = paramsObject;
		} else {
			result[route.route] = null;
		}
	}

	return fs.writeFile(
		path.resolve(__dirname, "./hooks/routes.json"),
		JSON.stringify(result, null, 1),
		"utf8",
	);
}
