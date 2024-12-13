import { useEffect, useState } from "react";

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("Authorization");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Funzione asincrona per ottenere i prodotti
  const getProductsFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/products?page=${page}&pageSize=${pageSize}`,
        { headers }
      );
      if (!response.ok) {
        throw new Error("Sorry, something went wrong");
      }
      const data = await response.json();
      setAllProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Effettua il fetch quando cambia la pagina o la dimensione della pagina
  useEffect(() => {
    getProductsFromApi();
  }, [page, pageSize, token]);

  return {
    allProducts,
    setAllProducts,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    error,
    totalPages,
    getProductsFromApi,
  };
};
