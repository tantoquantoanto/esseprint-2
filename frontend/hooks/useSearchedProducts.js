import { useState, useEffect } from "react";

const useSearchedBooks = (endpoint) => {
  const [searchedProducts, setSearchedProducts] = useState([]); 
  const [page,setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalSearchedPages, setTotalSearchedPages] = useState(1); 
  const [allProducts, setAllProducts] = useState([]); // Tutti i prodotti caricati dal backend
  const [inputValue, setInputValue] = useState(""); // Valore della barra di ricerca
  const [isLoading, setIsLoading] = useState(false); // Stato di caricamento
  const [error, setError] = useState(""); // Stato di errore

  // Funzione per aggiornare l'input
  const onChangeInput = (e) => {
    setInputValue(e.target.value);
  };

  // Funzione per filtrare i prodotti localmente
  const filterProducts = () => {
    if (inputValue === "") {
      setSearchedProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSearchedProducts(filtered);
    }
  };

 
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_BASE_URL}/products?page=${page}&pageSize=${pageSize}`,
            { headers }
        );
        if (!response.ok) {
            throw new Error("Sorry, something went wrong");
        }
        const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setAllProducts(data.products);
      setTotalSearchedPages(data.totalPages);
      setSearchedProducts(data.products); 
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Effettua la fetch all'avvio
  useEffect(() => {
    fetchProducts();
  }, []);

  // Aggiorna i prodotti visibili quando cambia l'input
  useEffect(() => {
    filterProducts();
  }, [inputValue, allProducts]);

  return {
    products,
    inputValue,
    onChangeInput,
    page, 
    setPage,
    pageSize,
    totalSearchedPages,
    setTotalSearchedPages,
    isLoading,
    error,
  };
};

export default useSearchedBooks;
