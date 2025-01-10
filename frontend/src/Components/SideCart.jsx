import React, { useEffect, useState } from "react";
import { Offcanvas, ListGroup, Row, Col, Image, Button, Modal } from "react-bootstrap";
import { useCart } from "../../hooks/useCart";
import { Edit, Trash } from "lucide-react"; 
import Swal from "sweetalert2";

const SideCart = ({ show, setShow, userId }) => {
  const { userOrders, products, getUserOrders, updateOrder } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(""); 

  useEffect(() => {
    if (show && userId && userOrders.length === 0) {
      getUserOrders(userId);
    }
  }, [show, userId, userOrders.length]);

  const handleClose = () => setShow(false);
  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.status);  
    setShowModal(true);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',  
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione dell'ordine");
      }

      getUserOrders(userId);
      Swal.fire("Success", "Ordine eliminato con successo!", "success");
    } catch (error) {
      console.error("Errore nella cancellazione dell'ordine", error);
      Swal.fire("Error", "Errore nella cancellazione dell'ordine", "error");
    }
  };

  const getProductDetails = (productId) => {
    const product = products.find((prod) => prod._id === productId);
    return product ? product : null;
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end" scroll>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Il Tuo Carrello</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {userOrders.length > 0 ? (
            <ListGroup>
              {userOrders.map((order, index) => (
                <ListGroup.Item key={index}>
                  <div>
                    <strong>Ordine {order._id}</strong>
                    <div>
                      <strong>Prodotti:</strong>
                      {order.products.map((productId, idx) => {
                        const product = getProductDetails(productId);
                        return product ? (
                          <Row key={idx} className="align-items-center my-2">
                            <Col xs={3}>
                              <Image src={product.img} alt={product.name} rounded width="60" />
                            </Col>
                            <Col xs={7}>
                              <div>{product.name}</div>
                            </Col>
                            <Col xs={2} className="text-end">
                              <span>{product.basePrice} €</span>
                            </Col>
                          </Row>
                        ) : (
                          <div key={idx}>Prodotto non trovato</div>
                        );
                      })}
                    </div>
                    <div>
                      <strong>Totale:</strong> {order.totalPrice} €
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteOrder(order._id)} 
                      >
                        <Trash /> Elimina
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Non hai ancora nessun ordine.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideCart;
