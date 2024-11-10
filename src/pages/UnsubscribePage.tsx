import { useEffect, useState, CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Head from "../components/Head";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/envs.util";
import { z } from "zod";

const unsubscribeEmailSchema = z.object({
	email: z.string().email({ message: "email inválido" }),
	unsubscribe_token: z.string().min(48).max(48, { message: "unsubscribe_token inválido" }),
});

export default function UnsubscribePage() {
	const { email, unsubscribe_token } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [unsubscribed, setUnsubscribed] = useState(false);

	useEffect(() => {
		if (!email || !unsubscribe_token) return navigate("/");

		try {
			unsubscribeEmailSchema.parse({ email, unsubscribe_token });
		} catch (error) {
			return navigate("/");
		}

		const unsubscribeEmail = async () => {
			setIsLoading(true);
			try {
				const response = await (await fetch(`${API_URL}/unsubscribe/${email}/${unsubscribe_token}`)).json();

				if (response.success) setUnsubscribed(true);
			} catch (error: any) {
			} finally {
				setIsLoading(false);
			}
		};

		unsubscribeEmail();
	}, [email, unsubscribe_token, navigate]);

	return (
		<>
			<Head title="Galhardo Newsletter" description="Unsubscribe email" />

			<div className="mx-auto lg:w-7/12" style={{ marginTop: "50px" }}>
				<div className="row">
					<div className="mx-auto lg:w-7/12 text-center">
						<a href="/" className="text-decoration-none">
							<h1 className="mb-5 fw-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
								Galhardo Newsletter
							</h1>
						</a>

						{isLoading && (
							<div className="mt-5 alert alert-info mt-3 text-center" role="alert">
								Processando...
							</div>
						)}

						{!isLoading && unsubscribed && (
							<>
								<div className="mt-5 alert alert-warning mt-3 text-center" role="alert">
									Email: <span className="fw-bold">{email}</span> foi desinscrito!
									<br />
								</div>
							</>
						)}

						{!isLoading && !unsubscribed && (
							<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
								Houve algum erro. Por favor, tente novamente mais tarde.
							</div>
						)}
					</div>
				</div>
			</div>

			<br className="mt-5" />
		</>
	);
}
