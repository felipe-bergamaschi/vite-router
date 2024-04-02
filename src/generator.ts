import fs from "node:fs/promises";
import path from "node:path";
import { buildComponent, buildFile, buildLazyImport } from "./template";
import type { Layout, Route, RouterProps } from "./types";
import { walk } from "./walk";

export async function generateRoutes(props: RouterProps) {
	const paths = walk(props.dir);

	/** Record<directory, fullPath> */
	const layouts: Record<string, Layout> = {};
	const routes: Route[] = [];

	let index = 0;
	for await (const filepath of paths) {
		const { base, name, ext, dir } = path.parse(filepath);
		// full relative path without extension
		const relative =
			// typescript always uses / as path separator
			`./${path
				.relative(path.dirname(props.output), filepath)
				.slice(undefined, -ext.length)}`;

		// Isn't a file route
		if (!props.extensions.includes(ext)) {
			continue;
		}

		// Checks if the filename is not [id]something.ext
		if (
			(name.startsWith("[") && !name.endsWith("]")) ||
			(!name.startsWith("[") && name.endsWith("]"))
		) {
			console.error(
				`ERR: The file is not a valid route (${path.relative(
					props.root,
					filepath,
				)})`,
			);
			continue;
		}

		// Is a layout file
		if (props.layouts.includes(base)) {
			if (!layouts[dir]) {
				layouts[dir] = {
					path: relative.replaceAll("\\", "/"),
					index: index++,
				};
			} else {
				console.error(
					`ERR: Multiple layouts found in the same directory (${path.relative(
						props.root,
						dir,
					)}), using (${path.relative(props.root, filepath)}).`,
				);
			}

			continue;
		}

		// removes root dir
		let route = dir.slice(props.dir.length);

		// Only adds filename if it's not index
		if (name !== "index") {
			// replaces [named] path with :named
			route += `/${name.replace(/\[(.+?)\]/g, ":$1")}`;
		}

		routes.push({
			// Handle index names
			route: route === "" ? "/" : route.replaceAll("\\", "/"),
			path: relative.replaceAll("\\", "/"),
			directory: dir,
			index: index++,
		});
	}

	// Finds the layout for each route
	for (const route of routes) {
		let dir = route.directory;

		// Finds the layout for the route while our root directory is not reached
		do {
			route.layout = layouts[dir];
			dir = path.dirname(dir);
		} while (!route.layout && dir.length >= props.dir.length);
	}

	const imports = routes.map((r) => buildLazyImport(`Route${r.index}`, r.path));

	const layoutImports = Object.values(layouts).map((l) =>
		buildLazyImport(`Layout${l.index}`, l.path),
	);

	const builtRoutes = routes.map((r) => {
		const component = buildComponent(`Route${r.index}`);

		return buildComponent("Route", {
			path: `"${r.route}"`,
			key: `"${r.route}"`,
			element: r.layout
				? buildComponent(`Layout${r.layout.index}`, undefined, component)
				: component,
		});
	});

	await fs.writeFile(
		props.output,
		buildFile(props.router, builtRoutes, imports, layoutImports),
		"utf-8",
	);

	await props.onRoutesGenerated?.(routes);

	console.info(
		`Generated ${routes.length} routes at ${path.relative(
			props.root,
			props.output,
		)}`,
	);
}
