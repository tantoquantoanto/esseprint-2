import { useParams, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { useEffect } from "react";
import { CheckCircleIcon } from "lucide-react"; 
import "./pagescss/successLoginPage.css"; 

const SuccessLoginPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem("Authorization", token);
        }

        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, token]);
    return (
        <Container className="text-center success-login">
            <div className="success-message">
                <CheckCircleIcon className="check-icon" size={80} />
                <h1>Welcome!</h1>
                <p>Sei stato autenticato con successo 🎉</p>
                <Button variant="success" size="lg" className="home-button" onClick={() => navigate("/")}>
                    Vai alla Home
                </Button>
                <p className="redirect-message">
                    Tra pochi secondi verrai riportato automaticamente alla home.
                </p>
            </div>
        </Container>
    );
};

export default SuccessLoginPage;