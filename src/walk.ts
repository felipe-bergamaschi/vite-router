import { readdir } from "node:fs/promises";
import path from "node:path";

/** Walks through a directory and returns a generator of all the files */
export async function* walk(dir: string): AsyncGenerator<string, void, void> {
	const contents = await readdir(dir, { withFileTypes: true });

	for (const content of contents) {
		const res = path.resolve(dir, content.name);

		if (content.isDirectory()) {
			yield* walk(res);
		} else {
			yield res;
		}
	}
}
