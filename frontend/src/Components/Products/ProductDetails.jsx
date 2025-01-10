import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useSession from "../../../hooks/useSession";
import Swal from "sweetalert2";
import NavBar from "../Navbar/NavBar";
import RotateLoaderComponent from "../Loaders/RotateLoaderComponent";
import { useProducts } from "../../../hooks/useProducts";
import "./productsCss/productDetails.css";
import Footer from "../Footer";

const ProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const { allProducts } = useProducts();
  const { productId } = useParams();
  const [singleProduct, setSingleProduct] = useState(null);
  const [customization, setCustomization] = useState({
    text: "",
    color: "",
    quantity: 1,
    imageUpload: null,
    _id: null,  
  });
  const [customizationPrice, setCustomizationPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);  
  const token = localStorage.getItem("Authorization");
  const session = useSession();
  const isUser = session?.role === "user";
  const isAdmin = session?.role === "admin";  

  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    basePrice: 0,
    category: "",
    img: "",
  });

  const getSingleProduct = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      setSingleProduct(data.product);
      
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/products/delete/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete product");

      Swal.fire("Success", "Product deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  const handleShowModal = () => {
    if (singleProduct) {
      setProductDetails({
        name: singleProduct.name,
        description: singleProduct.description,
        basePrice: singleProduct.basePrice,
        category: singleProduct.category,
        img: singleProduct.img,
      });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/products/update/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productDetails),
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      const updatedProduct = await response.json();
      setSingleProduct(updatedProduct.product);
      Swal.fire("Success", "Product updated successfully", "success");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  useEffect(() => {
    getSingleProduct(productId);
  }, [productId]);

  if (loading) {
    return <RotateLoaderComponent />;
  }

  if (!singleProduct) {
    return <p>Product not found.</p>;
  }

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="product-card shadow-sm mb-4">
              <Card.Img variant="top" src={singleProduct.img} />
              <Card.Body>
                <Card.Title className="fw-bold product-name">{singleProduct.name}</Card.Title>
                <Card.Text className="text-muted product-description">{singleProduct.description}</Card.Text>
                <Card.Text className="text-info product-category">{singleProduct.category}</Card.Text>
                <Card.Text className="product-price">{singleProduct.basePrice} €</Card.Text>
                <Card.Text className="product-price"><strong>Prezzo Finale:</strong> {finalPrice} €</Card.Text> 
              </Card.Body>
              {isAdmin && (
                <Card.Footer>
                  <Button variant="warning" onClick={handleShowModal}>Modifica</Button>
                  <Button variant="danger" onClick={handleDeleteProduct}>Elimina</Button>
                </Card.Footer>
              )}
            </Card>
          </Col>
          <Col md={6}>
            {isUser && (
              <Row className="mt-4">
                <Col md={12}>
                  <h5 className="customization-title">Se vuoi personalizzare il tuo prodotto...</h5>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Testo</Form.Label>
                      <Form.Control
                        type="text"
                        name="text"
                        value={customization.text}
                        onChange={handleCustomizationChange}
                        className="customization-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Colore</Form.Label>
                      <Form.Control
                        type="text"
                        name="color"
                        value={customization.color}
                        onChange={handleCustomizationChange}
                        className="customization-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantità</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        min="1"
                        value={customization.quantity}
                        onChange={handleCustomizationChange}
                        className="customization-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Carica un'immagine</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleImageUpload}
                        className="customization-input"
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={submitCustomization} className="customize-btn">
                      Aggiungi al carrello
                    </Button>
                  </Form>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prodotto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={productDetails.name}
                onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                type="text"
                value={productDetails.description}
                onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prezzo</Form.Label>
              <Form.Control
                type="number"
                value={productDetails.basePrice}
                onChange={(e) => setProductDetails({ ...productDetails, basePrice: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                value={productDetails.category}
                onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Immagine</Form.Label>
              <Form.Control
                type="text"
                value={productDetails.img}
                onChange={(e) => setProductDetails({ ...productDetails, img: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Salva modifiche
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Footer />
    </>
  );
};

export default ProductDetails;
