// import { useNavigate } from "vite-plugin-router/dist/hooks/useNavigate";

import { useNavigate } from "./util/navigate";

export default function Index() {
	const navigate = useNavigate();

	return (
		<div>
			<h1>Index</h1>
			<button
				type="button"
				onClick={() => {
					navigate("/admin", {
						params: {
							extra: "extra",
						},
					});
				}}
			>
				vai
			</button>
		</div>
	);
}
