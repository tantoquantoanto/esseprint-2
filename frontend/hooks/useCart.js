import { useState } from "react";

export const useCart = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("Authorization");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

 
  const getUserOrders = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/${userId}`, 
        {
          method: "GET",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user orders");

      const data = await response.json();
      setUserOrders(data.user.orders || []);

     
      const fetchProductDetails = async () => {
        const productsDetails = [];
        for (let order of data.user.orders) {
          for (let productId of order.products) {
            const productResponse = await fetch(
              `${import.meta.env.VITE_SERVER_BASE_URL}/products/${productId}`, 
              {
                method: "GET",
                headers: {
                  ...headers,
                  "Content-Type": "application/json",
                },
              }
            );

            if (productResponse.ok) {
              const productData = await productResponse.json();
              productsDetails.push(productData.product);
            }
          }
        }
        setProducts(productsDetails); 
      };

      await fetchProductDetails(); 
    } catch (error) {
      console.error("Error fetching orders or products:", error);
    }
  };

  return {
    userOrders,
    products,  
    getUserOrders,
  };
};
