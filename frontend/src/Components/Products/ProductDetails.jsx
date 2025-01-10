import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useSession from "../../../hooks/useSession";
import Swal from "sweetalert2";
import NavBar from "../Navbar/NavBar";
import RotateLoaderComponent from "../Loaders/RotateLoaderComponent";
import { useProducts } from "../../../hooks/useProducts";
import "./productsCss/productDetails.css"
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

  const getCustomizationForProduct = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/customizations?product=${productId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch customization");

      const data = await response.json();

      if (data.customization) {
        setCustomization(data.customization);
        setCustomizationPrice(data.customization.customizationPrice);
      } else {
        setCustomization({
          text: "",
          color: "",
          quantity: 1,
          imageUpload: null,
          _id: null,
        });
        setCustomizationPrice(2);  
      }
    } catch (error) {
      console.error("Error fetching customization:", error);
    }
  };

 
  const calculateFinalPrice = () => {
    let price = singleProduct.basePrice;

    if (customization.text) {
      price += 2;  
    }

    if (customization.imageUpload) {
      price += 5;  
    }

    setFinalPrice(price);
  };

  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization((prev) => {
      const newCustomization = { ...prev, [name]: value };
      calculateFinalPrice(); 
      return newCustomization;
    });
  };

  const handleImageUpload = (e) => {
    setCustomization((prev) => {
      const newCustomization = { ...prev, imageUpload: e.target.files[0] };
      calculateFinalPrice(); 
      return newCustomization;
    });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("img", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/customizations/upload`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.img;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const submitCustomization = async () => {
    let imageUrl = null;
  
   
    if (customization.imageUpload) {
      try {
        imageUrl = await uploadImage(customization.imageUpload);
      } catch (error) {
        Swal.fire("Error", "Image upload failed.", "error");
        return;
      }
    }
  
   
    let calculatedCustomizationPrice = 0;
    
    if (customization.text || customization.color || customization.imageUpload) {
      
      calculatedCustomizationPrice = 2;
      
      if (customization.imageUpload) {
        calculatedCustomizationPrice += 5;
      }
    }
  
   
    const data = {
      product: productId,
      text: customization.text,
      color: customization.color,
      quantity: customization.quantity,
      customizationPrice: calculatedCustomizationPrice,
      imageUpload: imageUrl,
    };
  
    try {
      setLoading(true);
  
      let response;
      
      if (customization && customization._id) {
        response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/customizations/update/${customization._id}`,
          {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/customizations/create`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      }
  
      if (!response.ok) throw new Error("Failed to submit customization");
  
      const result = await response.json();
      console.log("Customization result:", result);
  
      Swal.fire("Success",  "Personalizzazione aggiunta con successo, riceverai presto una mail dai nostri esperti grafici con la bozza da approvare e i dettagli sul pagamento.!", "success");
  
      
      setCustomization(result.savedCustomization || data);
      setCustomizationPrice(result.savedCustomization.customizationPrice || calculatedCustomizationPrice);
      calculateFinalPrice();  
      const customizationId = result.savedCustomization ? result.savedCustomization._id : null;
      await addToCart(customizationId, result.savedCustomization ? result.savedCustomization.customizationPrice : 0);
  
    } catch (error) {
      console.error("Error submitting customization:", error);
      Swal.fire("Error", "Failed to add/update customization.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = async (customizationId, customizationPrice) => {
   
    const cartData = {
      user: session.userId,
      products: [productId],
      customizations: customizationId ? [customizationId] : [],  
      customizationPrice: customizationPrice,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });
  
      if (!response.ok) throw new Error("Failed to add product to cart");
  
      const result = await response.json();
      setTimeout(() => {
        Swal.fire("Success", "Prodotto aggiunto al carrello con successo!", "success");
      }, 2000); 
      
  
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Swal.fire("Error", "Failed to add product to cart.", "error");
    }
  };
  


  useEffect(() => {
    getSingleProduct(productId);
    getCustomizationForProduct();  
  }, [productId]);

  useEffect(() => {
    if (singleProduct) {
      calculateFinalPrice(); 
    }
  }, [singleProduct, customization]);

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
      <Footer/>
    </>
  );
};

export default ProductDetails;
