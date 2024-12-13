import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useSession from "../../../hooks/useSession";
import Swal from "sweetalert2";
import NavBar from "../Navbar/NavBar";


import RotateLoaderComponent from "../Loaders/RotateLoaderComponent";
import ProductsEditingModal from "./ProductsEditingModal";
import { useProducts } from "../../../hooks/useProducts";

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
  });
  const [customizationPrice, setCustomizationPrice] = useState(0);
  const token = localStorage.getItem("Authorization");
  const session = useSession();
  const isUser = session?.role === "user";

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

  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setCustomization((prev) => ({ ...prev, imageUpload: e.target.files[0] }));
  };

  const submitCustomization = async () => {
    const formData = new FormData();
    formData.append("product", productId);
    formData.append("text", customization.text);
    formData.append("color", customization.color);
    formData.append("quantity", customization.quantity);
    formData.append("customizationPrice", customizationPrice);
    if (customization.imageUpload) {
      formData.append("imageUpload", customization.imageUpload);
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/customizations/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to submit customization");

      Swal.fire("Success", "Customization added successfully!", "success");
    } catch (error) {
      console.error("Error submitting customization:", error);
      Swal.fire("Error", "Failed to add customization.", "error");
    } finally {
      setLoading(false);
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
          <Col md={8} lg={6}>
            <Card className="shadow-sm mb-4">
              <Card.Img variant="top" src={singleProduct.img} />
              <Card.Body>
                <Card.Title className="fw-bold">{singleProduct.name}</Card.Title>
                <Card.Text className="text-muted">{singleProduct.description}</Card.Text>
                <Card.Text className="text-info">{singleProduct.category}</Card.Text>
                <Card.Text>{singleProduct.basePrice} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {isUser && (
          <Row className="mt-4">
            <Col md={8} lg={6}>
              <h5>Customize Your Product</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    type="text"
                    name="text"
                    value={customization.text}
                    onChange={handleCustomizationChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    value={customization.color}
                    onChange={handleCustomizationChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="1"
                    value={customization.quantity}
                    onChange={handleCustomizationChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleImageUpload}
                  />
                </Form.Group>
                <Button variant="primary" onClick={submitCustomization}>
                  Submit Customization
                </Button>
              </Form>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default ProductDetails;
