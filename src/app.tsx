import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/not-found.page";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import HomePage from "./pages/home.page";
import ConfirmEmailPage from "./pages/confirm-email.page";
import ResendConfirmEmailLinkPage from "./pages/resend-confirm-email-link.page";
import UnsubscribePage from "./pages/unsubscribe.page";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/confirm-email/:email/:confirm_email_token" element={<ConfirmEmailPage />} />
				<Route path="/unsubscribe/:email/:unsubscribe_token" element={<UnsubscribePage />} />
				<Route path="/resend-confirm-email-link" element={<ResendConfirmEmailLinkPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}
