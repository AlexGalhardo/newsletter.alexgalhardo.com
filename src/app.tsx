import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import HomePage from "./pages/HomePage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import ResendConfirmEmailLinkPage from "./pages/ResendConfirmEmailLinkPage";
import UnsubscribePage from "./pages/UnsubscribePage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/confirm-email/:email/:confirm_email_token" element={<ConfirmEmailPage />} />
				<Route path="/unsubscribe/:email/:unsubscribe_token" element={<UnsubscribePage />} />
				<Route path="/resend-confirm-email-link" element={<ResendConfirmEmailLinkPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
