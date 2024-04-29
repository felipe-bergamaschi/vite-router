import fs from "node:fs/promises";
import path from "node:path";
import {
	buildComponent,
	buildDefaultImport,
	buildFile,
	buildLazyImport,
} from "./template";
import type { Layout, Route, RouterProps } from "./types";
import { walk } from "./walk";
import { hooksGenerator } from "./hooks";

export async function generateRoutes(props: RouterProps) {
	const paths = walk(props.dir);

	/** Record<directory, fullPath> */
	const layouts: Record<string, Layout> = {};
	const routes: Route[] = [];

	let index = 0;
	for await (const filepath of paths) {
		const { base, name, ext, dir } = path.parse(filepath);

		// TODO: Remove this line
		if (name === "styles") {
			continue;
		}

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
		let param: string | null = null;

		// Only adds filename if it's not index
		if (name !== "index") {
			param = name.replace(/\[(.+?)\]/g, ":$1");
			// replaces [named] path with :named
			route += `/${param}`;
		}

		routes.push({
			// Handle index names
			route: route === "" ? "/" : route.replaceAll("\\", "/"),
			path: relative.replaceAll("\\", "/").replace("index", ""),
			directory: dir,
			index: index++,
			params: param ? [param] : undefined,
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

	const imports =
		props.router === "HashRouter"
			? routes.map((r) => buildDefaultImport(`R${r.index}`, r.path))
			: routes.map((r) => buildLazyImport(`R${r.index}`, r.path));

	const layoutImports = Object.values(layouts).map((l) =>
		props.router === "HashRouter"
			? buildDefaultImport(`L${l.index}`, l.path)
			: buildLazyImport(`L${l.index}`, l.path),
	);

	const builtRoutes = routes.map((r) => {
		const component = buildComponent(`R${r.index}`);

		return buildComponent("Route", {
			path: `"${r.route}"`,
			key: `"${r.route}"`,
			element: r.layout
				? buildComponent(`L${r.layout.index}`, undefined, component)
				: component,
		});
	});

	// useNavigate generator
	await hooksGenerator(routes);

	await fs.writeFile(
		props.output,
		buildFile(
			props.router,
			builtRoutes,
			imports,
			layoutImports,
			Boolean(props.router === "BrowserRouter"),
		),
		"utf-8",
	);

	props.onRoutesGenerated?.(routes);

	console.info(
		`Generated ${routes.length} routes at ${path.relative(
			props.root,
			props.output,
		)}`,
	);
}
