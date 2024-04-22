import fs from "node:fs/promises";
import path from "node:path";

import type { Route } from "./types";

export async function hooksGenerator(routes: Route[]) {
	const types = await typeGenerator(routes);

	return await fs.writeFile(
		path.resolve(__dirname, "./hooks/types.ts"),
		types,
		"utf8",
	);
}

async function typeGenerator(routes: Route[]) {
	let typeDefs = "";
	typeDefs = "export interface ITypedRoutes {\n";

	for (const route of routes) {
		if (route.params) {
			if (!route.params.length) {
				typeDefs += `  "${route.route}": undefined;\n`;
				continue;
			}

			const params = route.params.reduce(
				(acc, cur) => {
					const paramName = cur.replace(":", "");

					acc[paramName] = "string";
					return acc;
				},
				{} as Record<string, string>,
			);

			const paramsString = JSON.stringify(params).replace(/"/g, "");
			typeDefs += `  "${route.route}": ${paramsString};\n`;
		} else {
			typeDefs += `  "${route.route}": undefined;\n`;
		}
	}

	typeDefs += "};\n";
	return typeDefs;
}
