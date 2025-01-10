import "./pagescss/chisiamo.css";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../Components/Navbar/NavBar";
import Footer from "../Components/Footer";

const ChiSiamo = () => {
  return (
    <>
      <NavBar />
      <Container fluid className="chi-siamo-page py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <h1 className="chi-siamo-title mb-4">Chi Siamo</h1>
            <p className="chi-siamo-description mb-5">
              Benvenuto su Esseprint, il tuo punto di riferimento per la personalizzazione di prodotti unici! Siamo un team di creativi appassionati di design e innovazione, con l'obiettivo di offrirti articoli personalizzati che riflettano il tuo stile e la tua personalità.
            </p>
            <p className="chi-siamo-description mb-5">
              Che si tratti di t-shirt, borse, accessori o gadget, su Esseprint puoi scegliere tra una vasta gamma di prodotti e aggiungere il tuo tocco personale. Grazie alla nostra piattaforma, puoi facilmente creare il prodotto che hai sempre desiderato, utilizzando i tuoi design, testi e immagini.
            </p>
            <p className="chi-siamo-description mb-5">
              La nostra missione è rendere ogni prodotto unico come te, offrendo un'esperienza semplice, divertente e di alta qualità. Esplora le infinite possibilità di personalizzazione e inizia a creare oggi il tuo articolo personalizzato su Esseprint!
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ChiSiamo;
