import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from 'sweetalert2';
import RotateLoaderComponent from "../Loaders/RotateLoaderComponent";

const ProductsEditingModal = ({ show, handleClose, product }) => {

 const [loading, setLoading] = useState(false);


  const [formState, setFormState] = useState({
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    category: product.category,
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("img", file);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_BASE_URL}/products/upload/cloud`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Failed to upload image");

    const data = await response.json();
    return data.img;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = product.img;

    if (file) {
      try {
        imageUrl = await uploadFile(file);
      } catch (error) {
        console.error("Image upload failed:", error);
        return;
      }
    }

    const updatedData = { ...formState, img: imageUrl };

    try {
      
      await updateSingleProduct(product._id, updatedData);
      Swal.fire("Successo!", "Prodotto aggiornato con successo.", "success");
      handleClose();

    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Errore!", "Aggiornamento del prodotto fallito.", "error");
    }
  };



  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Prodotto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? ( 
         <RotateLoaderComponent/>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProductName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductCategory">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formState.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductBasePrice">
              <Form.Label>Prezzo base</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="basePrice"
                value={formState.basePrice}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductImage">
              <Form.Label>Immagine</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Salva modifiche
            </Button>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductsEditingModal;