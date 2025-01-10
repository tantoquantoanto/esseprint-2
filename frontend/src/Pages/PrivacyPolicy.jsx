
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../Components/Navbar/NavBar";
import Footer from "../Components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <NavBar />
      <Container fluid className="privacy-policy-page py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <h1 className="privacy-policy-title mb-4">Privacy Policy</h1>
            <p className="privacy-policy-description mb-5">
              La tua privacy è importante per noi. Questa informativa sulla privacy spiega come raccogliamo, utilizziamo, e proteggiamo i tuoi dati personali quando visiti o utilizzi il nostro sito web.
            </p>
            <h2 className="privacy-policy-section-title mb-4">1. Informazioni che Raccogliamo</h2>
            <p className="privacy-policy-description mb-5">
              Potremmo raccogliere informazioni personali come nome, indirizzo email, e dati relativi all’utilizzo del nostro sito. I dati vengono raccolti attraverso la compilazione di moduli, la registrazione, e l’interazione con il sito.
            </p>
            <h2 className="privacy-policy-section-title mb-4">2. Utilizzo delle Informazioni</h2>
            <p className="privacy-policy-description mb-5">
              Utilizziamo le informazioni raccolte per fornire i nostri servizi, personalizzare l’esperienza degli utenti, migliorare la nostra piattaforma, e comunicare aggiornamenti o risposte alle richieste degli utenti.
            </p>
            <h2 className="privacy-policy-section-title mb-4">3. Condivisione delle Informazioni</h2>
            <p className="privacy-policy-description mb-5">
              Non condividiamo i tuoi dati personali con terze parti, a meno che non sia necessario per conformarsi a obblighi di legge o per migliorare la qualità dei servizi, previo consenso.
            </p>
            <h2 className="privacy-policy-section-title mb-4">4. Protezione dei Dati</h2>
            <p className="privacy-policy-description mb-5">
              Adottiamo misure di sicurezza tecniche e organizzative per proteggere i dati personali da accessi non autorizzati, alterazioni, divulgazione o distruzione.
            </p>
            <h2 className="privacy-policy-section-title mb-4">5. I tuoi Diritti</h2>
            <p className="privacy-policy-description mb-5">
              Hai il diritto di accedere, rettificare, cancellare, o limitare l’uso dei tuoi dati personali in nostro possesso. Puoi anche opporti al trattamento dei tuoi dati per finalità di marketing.
            </p>
            <h2 className="privacy-policy-section-title mb-4">6. Modifiche alla Privacy Policy</h2>
            <p className="privacy-policy-description mb-5">
              Ci riserviamo il diritto di modificare questa informativa sulla privacy in qualsiasi momento. Ti informeremo di eventuali cambiamenti pubblicando la nuova informativa su questa pagina.
            </p>
            <p className="privacy-policy-description mb-5">
              Se hai domande o dubbi riguardo la nostra informativa sulla privacy, ti preghiamo di contattarci tramite i canali indicati nella sezione Contatti del nostro sito.
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;