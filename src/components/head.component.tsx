import { useEffect } from "react";

export default function HeadComponent(props: { title: string | undefined; description: string }) {
	useEffect(() => {
		document.title = `${props.title}`;
		document?.querySelector("meta[name='description']")?.setAttribute("content", props.description || "");
	}, [props]);

	return <></>;
}
