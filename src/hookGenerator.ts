import fs from "node:fs/promises";
import path from "node:path";

import type { Route } from "./types";

export async function hookGenerator(routes: Route[]) {
	const schema = schemaGenerator(routes);
	const types = typesGenerator(routes);

	await fs.writeFile(
		path.resolve(__dirname, "./hooks/schema.json"),
		JSON.stringify(schema, null, 2),
		"utf8",
	);

	await fs.writeFile(
		path.resolve(__dirname, "./hooks/routes.d.ts"),
		types,
		"utf8",
	);
}

function schemaGenerator(routes: Route[]) {
	const result = {};

	for (const route of routes) {
		if (
			route.params &&
			Array.isArray(route.params) &&
			route.params.length > 0
		) {
			const paramsObject = {};
			for (const param of route.params) {
				const paramName = param.replace(":", "");
				// @ts-ignore
				paramsObject[paramName] = { type: "string" };
			}
			// @ts-ignore
			result[route.route] = {
				type: "object",
				properties: paramsObject,
				required: Object.keys(paramsObject),
			};
		} else {
			// @ts-ignore
			result[route.route] = {};
		}
	}

	return {
		type: "object",
		properties: result,
		additionalProperties: false,
	};
}

export function typesGenerator(routes: Route[]) {
	const entries: string[] = [];

	for (const route of routes) {
		if (
			route.params &&
			Array.isArray(route.params) &&
			route.params.length > 0
		) {
			const paramsEntries: string[] = [];
			for (const param of route.params) {
				const paramName = param.replace(":", "");
				paramsEntries.push(`${paramName}: string`);
			}
			const paramsString = `{ ${paramsEntries.join(", ")} }`;
			entries.push(`"${route.route}": ${paramsString}`);
		} else {
			entries.push(`"${route.route}": null`);
		}
	}

	return `export type Routes = {\n  ${entries.join(",\n  ")}\n};`;
}
