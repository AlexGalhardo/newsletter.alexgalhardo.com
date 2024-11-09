import { useEffect, useState } from "react";
import Head from "../components/Head";
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
	const [formData, setFormData] = useState({
		email: "",
	});

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

			<Head title="Galhardo Newsletter" description="description" />

			<div className="mx-auto lg:w-7/12" style={{ marginTop: "50px" }}>
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="lg:w-7/12 mx-auto text-center">
							<h1 className="mb-5 fw-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
								Galhardo Newsletter
							</h1>

							<p className="mb-5 mt-5">
								Receba as melhores notícias sobre criptomoedas, ecomia e tecnologia no seu email!
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
												Email já registrado, mas ainda não foi verificado! Por favor, verifique
												esse email para receber as notícias!
											</div>
										)}

										<div className="mb-3">
											<input
												className="form-control fs-4"
												name="email"
												placeholder="Digite seu email principal"
												type="email"
												value={formData.email}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="mt-5">
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
										Um email de verificação foi enviado para:
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
							className="text-center mb-5 mt-5 text-success text-decoration-none"
						>
							Reenviar token de verificação
						</a>
					</div>
				</form>
			</div>
		</>
	);
}
