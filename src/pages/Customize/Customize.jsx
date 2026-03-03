import { useParams } from "react-router-dom";

export default function Customize() {
	const { title } = useParams();

	return <h1>Customize Page: {title}</h1>;
}