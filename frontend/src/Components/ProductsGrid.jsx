import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ResponsivePagination from "react-responsive-pagination";
import ProductsCard from "../Components/Products/ProductsCard"
import SearchInput from "./SearchInput";

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 6;

  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/products?page=${page}&pageSize=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch products.");
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <SearchInput
        onSearchResults={(results) => setProducts(results)}
        onResetSearch={() => fetchProducts(currentPage)}
      />
      <Row className="gy-4">
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4}>
            <ProductsCard {...product} />
          </Col>
        ))}
      </Row>
      <div className="mt-4 d-flex justify-content-center">
        <ResponsivePagination
          current={currentPage}
          total={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
};

export default ProductsGrid;
