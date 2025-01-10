import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "./productsCss/hero.css";
import RotateLoaderComponent from "../Loaders/RotateLoaderComponent";

const Hero = () => {
    const [products, setProducts] = useState([]);
    const [randomProduct, setRandomProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_BASE_URL}/products`
          );
          if (!response.ok) throw new Error("Failed to fetch products.");
          const data = await response.json();
          setProducts(data.products); 
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
           
            const randomIndex = Math.floor(Math.random() * products.length);
            setRandomProduct(products[randomIndex]);
        }
    }, [products]); 

    
    if (loading) {
        return (
            <RotateLoaderComponent />
        );
    }

    if (error) {
        return (
            <Container className="products-hero my-4">
                <Row className="justify-content-center">
                    <Col md={12} className="text-center">
                        <h3>Error loading products: {error}</h3>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!randomProduct) {
        return (
            <Container className="products-hero my-4">
                <Row className="justify-content-center">
                    <Col md={12} className="text-center">
                        <h3>No products available</h3>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="products-hero my-4">
            <Row className="justify-content-center">
                <Col md={12} className="text-center">
                    <Card className="bg-dark text-white border-0 hero-card">
                        <div
                            className="hero-img-container"
                            style={{ backgroundImage: `url(${randomProduct.img})` }}
                        >
                            <div className="card-img-overlay d-flex flex-column justify-content-center text-overlay">
                                <Card.Title className="display-3 hero-title">{randomProduct.name}</Card.Title>
                                <Card.Text className="lead">
                                    {randomProduct.description}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    href={`/products/${randomProduct._id}`}
                                    className="hero-button"
                                >
                                    Scopri di più
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Hero;
