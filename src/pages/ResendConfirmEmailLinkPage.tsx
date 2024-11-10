import { useState } from "react";
import Head from "../components/Head";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/envs.util";
import { z } from "zod";

const emailSchema = z.object({
	email: z.string().email({ message: "Por favor, digite um email válido!" }),
});

export default function ResendConfirmEmailLinkPage() {
	const [loading, setLoading] = useState(false);
	const [emailNotRegistered, setEmailNotRegistered] = useState(false);
	const [emailAlreadyConfirmed, setEmailAlreadyConfirmed] = useState(false);
	const [emailDeleted, setEmailDeleted] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [errorEmail, setErrorEmail] = useState("");
	const [formData, setFormData] = useState({
		email: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrorEmail("");
		setEmailNotRegistered(false);
		setEmailAlreadyConfirmed(false);
		setEmailDeleted(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = emailSchema.safeParse(formData);

		if (!result.success) return setErrorEmail(result.error.errors[0].message);

		try {
			setLoading(true);
			const response = await (
				await fetch(`${API_URL}/resend-confirm-email-link`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: formData.email,
					}),
				})
			).json();

			console.log("response -> ", response);

			if (!response?.success && response?.email_deleted) {
				setEmailDeleted(true);
			} else if (!response?.success && response?.email_not_registered) {
				setEmailNotRegistered(true);
			} else if (!response?.success && response?.email_already_confirmed) {
				setEmailAlreadyConfirmed(true);
			} else {
				setEmailSent(true);
			}
		} catch (error) {
			console.log("error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Head
				title="Reenviar link para ativar email"
				description="Reenviar link para ativar email no Galhardo Newsletter."
			/>

			<div className="mx-auto lg:w-7/12" style={{ marginTop: "50px" }}>
				<form onSubmit={handleSubmit}>
					<div className="row">
						<div className="mx-auto lg:w-7/12 text-center">
							<a href="/" className="text-decoration-none">
								<h1 className="mb-5 fw-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
									Galhardo Newsletter
								</h1>
							</a>

							<p className="mb-5 mt-5 me-4 ms-4">
								Cadastrou seu email mas esqueceu ou perdeu seu link de ativação?
							</p>

							<p className="mb-5 mt-5 me-4 ms-4">
								Digite seu email novamente para receber o link de ativação.
							</p>

							<div className="modal-body me-4 ms-4">
								{!emailSent && (
									<>
										{errorEmail && (
											<div className="mt-5 alert alert-danger text-center" role="alert">
												{errorEmail}
											</div>
										)}

										{emailDeleted && (
											<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
												Esse email foi desinscrito!
											</div>
										)}

										{emailAlreadyConfirmed && (
											<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
												Esse email já foi confirmado!
											</div>
										)}

										{emailNotRegistered && (
											<div className="mt-5 alert alert-danger mt-3 text-center" role="alert">
												Esse email ainda não foi registrado!
											</div>
										)}

										<div className="mb-3">
											<input
												className="form-control fs-4"
												name="email"
												placeholder="Email que vai receber o link"
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
												{loading ? "Processando..." : "Reenviar link para ativar email"}
											</button>
										</div>
									</>
								)}

								{emailSent && (
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
					</div>
				</form>
			</div>

			<br className="mt-5" />
		</>
	);
}
