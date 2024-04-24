import qs from "qs";
import { useNavigate as useRRDNavigate } from "react-router-dom";
import type routes from "./routes.json";

type RouteEntry = {
	readonly [K: string]: Readonly<Record<string, string>> | null;
};

type ExtractRouteParams<T> = T extends Record<string, string>
	? { [K in keyof T as K extends string ? K : never]: string }
	: undefined;

type DynamicRoutes<T extends RouteEntry> = {
	[P in keyof T]: ExtractRouteParams<T[P]>;
};

type ITypedRoutes = DynamicRoutes<typeof routes>;

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

		// @ts-ignore
		if (path.includes(":")) {
			// @ts-ignore
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

		// @ts-ignore
		const queryString = qs.stringify(params.params);
		const finalPath = queryString
			? `${pathWithParams}?${queryString}`
			: pathWithParams;

		navigate(finalPath);
	};
}
