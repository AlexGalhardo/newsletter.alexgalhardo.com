import { useEffect, useState } from "react";
import HeadComponent from "../components/head.component";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/envs.util";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { z } from "zod";

const emailSchema = z.object({
	email: z.string().email({ message: "Por favor, digite um email válido!" }),
});

export default function HomePage() {
	const [loading, setLoading] = useState(false);
	const [emailRegisteredSuccess, setEmailRegisteredSuccess] = useState(false);
	const [emailAlreadyRegisteredAndEmailConfirmed, setEmailAlreadyRegisteredAndEmailConfirmed] = useState(false);
	const [emailAlreadyRegisteredAndEmailNotConfirmed, setEmailAlreadyRegisteredAndEmailNotConfirmed] = useState(false);
	const [errorEmail, setErrorEmail] = useState("");
	const [totalSubscribers, setTotalSubscribers] = useState(0);
	const [formData, setFormData] = useState({
		email: "",
	});

	useEffect(() => {
		const fetchSubscribers = async () => {
			try {
				const response = await (await fetch(`${API_URL}/total-subscribers`)).json();
				if (response?.success && response?.total_subscribers) setTotalSubscribers(response?.total_subscribers);
				else {
					setTotalSubscribers(0);
				}
			} catch (error) {
				console.error("Error fetching subscriber count:", error);
			}
		};

		fetchSubscribers();
		const intervalId = setInterval(fetchSubscribers, 60000 * 60);

		return () => clearInterval(intervalId);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrorEmail("");
		setEmailAlreadyRegisteredAndEmailNotConfirmed(false);
		setEmailAlreadyRegisteredAndEmailConfirmed(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = emailSchema.safeParse(formData);

		if (!result.success) return setErrorEmail(result.error.errors[0].message);

		try {
			setLoading(true);

			const response = await (
				await fetch(`${API_URL}/email`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: formData.email,
					}),
				})
			).json();

			if (response?.success && response?.email_already_registered && response?.confirmed_email) {
				setEmailAlreadyRegisteredAndEmailConfirmed(true);
			} else if (response?.success && response?.email_already_registered && !response?.confirmed_email) {
				setEmailAlreadyRegisteredAndEmailNotConfirmed(true);
			} else if (response?.success) {
				setEmailRegisteredSuccess(true);
			} else {
				console.log("error");
			}
		} catch (error) {
			console.log("error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (emailRegisteredSuccess) {
			const timer = setTimeout(() => {
				setEmailRegisteredSuccess(false);
				setFormData((prev) => ({ ...prev, email: "" }));
			}, 10000);

			return () => clearTimeout(timer);
		}
	}, [emailRegisteredSuccess]);

	return (
		<>
			{emailRegisteredSuccess && <Fireworks autorun={{ speed: 4, duration: 10000 }} />}

			<HeadComponent title="Galhardo Newsletter" description="description" />

			<div className="mx-auto lg:w-7/12" style={{ marginTop: "50px" }}>
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="mx-auto lg:w-7/12 text-center">
							<h1 className="mb-5 fw-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
								Galhardo Newsletter
							</h1>

							<p className="mb-5 mt-5 me-4 ms-4">
								Junte se a nossa comunidade com{" "}
								<span className="text-warning fw-bold">{totalSubscribers}</span>{" "}
								{totalSubscribers === 1 ? "leitor ativo" : "leitores ativos"} e receba as melhores
								notícias sobre criptomoedas, economia e tecnologia no seu email, é grátis!
							</p>

							<p className="mb-5 mt-5">De segunda a sexta-feira, ao meio dia!</p>

							<div className="modal-body">
								{!emailRegisteredSuccess && (
									<>
										{errorEmail && (
											<div className="mt-5 alert alert-danger text-center" role="alert">
												{errorEmail}
											</div>
										)}

										{emailAlreadyRegisteredAndEmailConfirmed && (
											<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
												Email já registrado!
											</div>
										)}

										{emailAlreadyRegisteredAndEmailNotConfirmed && (
											<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
												Email já registrado, mas ainda não foi ativado! Por favor, verifique
												esse email para receber as notícias!
											</div>
										)}

										<div className="mb-3 me-4 ms-4">
											<input
												autoFocus
												className="form-control fs-4"
												name="email"
												placeholder="Digite seu email principal"
												type="email"
												value={formData.email}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="mt-5 me-4 ms-4">
											<button
												type="submit"
												disabled={loading}
												className="shadow-lg w-full text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-colors duration-300"
											>
												{loading ? "Processando..." : "Eu Quero!"}
											</button>
										</div>
									</>
								)}

								{emailRegisteredSuccess && (
									<div className="mt-5 alert alert-success mt-3 text-center" role="alert">
										Um email de ativação foi enviado para:
										<br />
										<br />
										<span className="fw-bold">{formData.email}</span>
										<br />
										<br />
										Por favor, verifique sua caixa de entrada, para ativar esse email.
									</div>
								)}
							</div>
						</div>

						<a
							href="/resend-confirm-email-link"
							className="text-center mb-5 mt-5 text-primary text-decoration-none"
						>
							Reenviar link para ativar email
						</a>
					</div>
				</form>
			</div>
		</>
	);
}
