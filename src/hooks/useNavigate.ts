import qs from "qs";
import type { ITypedRoutes } from "./types";

import { useNavigate as useRRDNavigate } from "react-router-dom";

type RouteParams<T extends keyof ITypedRoutes> =
	ITypedRoutes[T] extends undefined
		? { params?: Record<string, string> }
		: ITypedRoutes[T] & { params?: Record<string, string> };

export function useNavigate() {
	const navigate = useRRDNavigate();

	return function navigateTo<T extends keyof ITypedRoutes>(
		path: T,
		options?: RouteParams<T>,
	): void {
		const params = options ?? {};
		let pathWithParams = path;

		// Substituir parâmetros na URL, se houver
		if (path.includes(":")) {
			pathWithParams = path.replace(/\:[a-zA-Z]+/g, (match) => {
				const paramKey = match.substring(1); // Remove o ':'
				if (!(paramKey in params)) {
					throw new Error(
						`Missing parameter '${paramKey}' for route '${path}'`,
					);
				}
				return params[paramKey as keyof typeof params] as string;
			});
		}

		// Adicionar query strings, se houver
		const queryString = qs.stringify(params.params);
		const finalPath = queryString
			? `${pathWithParams}?${queryString}`
			: pathWithParams;

		navigate(finalPath);
	};
}
