import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import NavBar from "../Navbar/NavBar";
import RotateLoaderComponent from "../Loaders/RotateLoaderComponent";
import Swal from "sweetalert2"; 


const NewProductForm = () => {
  const [formState, setFormState] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Authorization");

  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const uploadFile = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("img", fileToUpload);

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/products/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      return await response.json();
    } catch (error) {
      console.log(error.message);
      Swal.fire("Errore", "Caricamento del file fallito!", "error");  
    } finally {
      setLoading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        setLoading(true);
        const uploadedFile = await uploadFile(file);
        if (!uploadedFile?.img) {
          Swal.fire("Errore", "Immagine non caricata correttamente!", "error");  
          return;
        }

        const postFormState = {
          ...formState,
          img: uploadedFile.img,
        };

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/products/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postFormState),
          }
        );

        if (response.ok) {
          Swal.fire("Successo", "Prodotto aggiunto con successo!", "success");  
        } else {
          Swal.fire("Errore", "Qualcosa è andato storto!", "error");  
        }
      } catch (error) {
        console.log(error.message);
        Swal.fire("Errore", "C'è stato un problema nel creare il prodotto!", "error");  
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire("Attenzione", "Devi caricare un'immagine!", "warning");  
    }
  };

  return (
    <>
      <NavBar />
      <Container className="my-5">
        {loading ? (
          <RotateLoaderComponent />
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <h1>Aggiungi un nuovo Prodotto</h1>
              </div>
            

            <Form encType="multipart/form-data" className="mt-4" onSubmit={submitProduct}>
              <Row className="d-flex align-items-center justify-content-center">
                <Col sm={12} md={8}>
                  <Row className="mb-3">
                    <Form.Group as={Col} sm={12} md={6} controlId="formName">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        onChange={onChangeInput}
                        type="text"
                        name="name"
                        placeholder="Inserisci il nome del prodotto"
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} controlId="formDescription">
                      <Form.Label>Descrizione</Form.Label>
                      <Form.Control
                        onChange={onChangeInput}
                        as="textarea"
                        name="description"
                        placeholder="Inserisci la descrizione"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group className="mb-3" controlId="formCategory">
                      <Form.Label>Categoria</Form.Label>
                      <Form.Control
                        onChange={onChangeInput}
                       type="text"
                        name="category"
                        placeholder="Assegna una categoria"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} sm={12} md={6} className="mb-3" controlId="formBasePrice">
                      <Form.Label>Prezzo base</Form.Label>
                      <Form.Control
                        onChange={onChangeInput}
                        type="text"
                        name="basePrice"
                        placeholder="Inserisci il prezzo base"
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col} sm={12} md={6} className="mb-3" controlId="formImages">
                      <Form.Label>Immagine</Form.Label>
                      <Form.Control
                        type="file"
                        name="img"
                        onChange={onChangeFile}
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Button variant="primary" type="submit" className="mt-2">
                    AggiungiProdotto
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        )}
      </Container>
      
    </>
  );
};

export default NewProductForm;