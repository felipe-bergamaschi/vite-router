import { useNavigate as useRRDNavigate } from "react-router-dom";

export function useNavigate() {
	const navigate = useRRDNavigate();

	function customNavigate(
		path: string,
		options?: { params?: Record<string, string> },
	) {
		let formattedPath = path as string;

		const queryParams = options?.params
			? new URLSearchParams(options.params).toString()
			: "";

		formattedPath += queryParams ? `?${queryParams}` : "";

		return navigate(formattedPath);
	}

	return customNavigate;
}
