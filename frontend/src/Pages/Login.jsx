import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LucidePlane } from "lucide-react"; 
import Footer from "../Components/Footer";


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loginRequest = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("Authorization", data.token);
        navigate("/", { replace: true });
      }
      return response;
    } catch (e) {
      console.log(e.message);
    }
  };

  const goToGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/github`;
  };

  const goToGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/google`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await loginRequest();
  };

  return (
    <>
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 vw-100">
      <div className="d-flex align-items-center mb-4 text-primary">
        <h1>Esseprint</h1>
      </div>
      <Row className="d-flex align-items-center justify-content-center w-100">
        <Col sm={12} md={4} className="d-flex flex-column align-items-center">
          <Form onSubmit={onSubmit} className="gap-4 w-100 rounded-2">
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={onChangeInput}
              className="rounded-4"
            />
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={onChangeInput}
              className="rounded-4 mt-2"
            />
            <Button className="mt-2 w-100 rounded-pill mt-2" variant="primary" type="submit">
              Accedi
            </Button>
          </Form>
          <div className="d-flex flex-column align-items-center gap-2 mt-1 w-100">
            <Button
              className="w-100 rounded-pill"
              variant="primary"
              onClick={goToGitHubLogin}
            >
              Accedi con Github
            </Button>
            <Button
              className="w-100 rounded-pill"
              variant="primary"
              onClick={goToGoogleLogin}
            >
              Accedi con Google
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
    <Footer/>
    </>
  );
};

export default Login;