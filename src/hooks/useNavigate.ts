import { useNavigate as useRRDNavigate } from "react-router-dom";
import type { Routes } from "./routes";

type Options<T extends keyof Routes> = Routes[T] extends null
	? { params?: Record<string, string> }
	: { params?: Record<string, string> } & Routes[T];

export function useNavigate() {
	return navigate;
}

function navigate<T extends keyof Routes>(path: T, options?: Options<T>) {
	let formattedPath = path as string;

	if (options) {
		const pathParams = formattedPath.match(/:\w+/g) || [];

		for (const param of pathParams) {
			const key = param.slice(1);

			if (options[key as keyof typeof options]) {
				formattedPath = formattedPath.replace(
					param,
					options[key as keyof typeof options] as string,
				);
			}
		}
	}

	const queryParams = options?.params
		? new URLSearchParams(options.params).toString()
		: "";

	formattedPath += queryParams ? `?${queryParams}` : "";

	return navigateTo(formattedPath);
}

function navigateTo(path: string) {
	const navigate = useRRDNavigate();

	navigate(path);
}
