import { useEffect, useState, CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Head from "../components/Head";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/envs.util";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { z } from "zod";
import ClipLoader from "react-spinners/PacmanLoader";

const confirmEmailSchema = z.object({
	email: z.string().email({ message: "Por favor, digite um email válido!" }),
	confirm_email_token: z.string().min(48).max(48, { message: "O token de confirmação deve ter 48 caracteres." }),
});

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

export default function ConfirmEmailPage() {
	const { email, confirm_email_token } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isConfirmed, setIsConfirmed] = useState(false);

	useEffect(() => {
		if (!email || !confirm_email_token) return navigate("/");

		try {
			confirmEmailSchema.parse({ email, confirm_email_token });
		} catch (error) {
			return navigate("/");
		}

		const confirmEmail = async () => {
			setIsLoading(true);
			try {
				const response = await (await fetch(`${API_URL}/confirm-email/${email}/${confirm_email_token}`)).json();

				if (response.success) {
					setIsConfirmed(true);
				}
			} catch (error: any) {
			} finally {
				setIsLoading(false);
			}
		};

		confirmEmail();
	}, [email, confirm_email_token, navigate]);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 10000);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<ClipLoader
				color={"#ffffff"}
				loading={isLoading}
				cssOverride={override}
				size={150}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		);
	}

	return (
		<>
			<Head title="Galhardo Newsletter" description="description" />

			<div className="mx-auto lg:w-7/12" style={{ marginTop: "50px" }}>
				<div className="row">
					<div className="mx-auto lg:w-7/12 text-center">
						<a href="/" className="text-decoration-none">
							<h1 className="mb-5 fw-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
								Galhardo Newsletter
							</h1>
						</a>

						{isConfirmed ? (
							<>
								<Fireworks autorun={{ speed: 1 }} />

								<div className="mt-5 alert alert-success mt-3 text-center" role="alert">
									Email: <span className="fw-bold">{email}</span> foi verificado!
									<br />
									<br />
									Você receberá as melhores notícias sobre criptomoedas, economia e tecnologia no seu
									email de segunda a sexta-feira ao meio dia!
								</div>
							</>
						) : (
							<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
								Houve um erro ao confirmar o seu email. Por favor, tente novamente mais tarde.
							</div>
						)}
					</div>
				</div>
			</div>

			<br className="mt-5" />
		</>
	);
}
