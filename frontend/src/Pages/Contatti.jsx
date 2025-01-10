import "./pagescss/contatti.css"
import { Container, Row, Col } from "react-bootstrap";
import EmailForm from "../Components/EmailForm";
import NavBar from "../Components/Navbar/NavBar";
import Footer from "../Components/Footer";

const Contatti = () => {
  return (
    <>
    <NavBar/>
    <Container fluid className="contact-page py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          <h1 className="contact-title mb-4">Contattaci</h1>
          <p className="contact-description mb-5">
            Siamo qui per rispondere a qualsiasi domanda o richiesta. Compila il modulo e ti risponderemo al più presto!
          </p>
          <EmailForm/>
        </Col>
      </Row>
    </Container>
    <Footer/>
    </>
  );
};

export default Contatti;