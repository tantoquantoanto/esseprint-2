import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/NavBar"

import Swal from "sweetalert2";

const UserDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [formState, setFormState] = useState({});
  const [file, setFile] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("Authorization");

  const getUserFromApi = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error("API Response Error:", response.status, response.statusText);
        return; 
      }
      const data = await response.json();
      console.log(data);
      if (data && data.user){
      setUser(data.user);
      setFormState({
        name: data.user.name,
        surname: data.user.surname,
        email: data.user.email,
        role: data.user.role,
        img: data.user.img,
      })
    };
    } catch (error) {
      console.log(error);
    }
  };

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
      `${import.meta.env.VITE_SERVER_BASE_URL}/users/upload/cloud`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Failed to upload image");

    const data = await response.json();
    return data.img;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formState.img;

    if (file) {
      try {
        imageUrl = await uploadFile(file);
      } catch (error) {
        console.error("Image upload failed:", error);
        Swal.fire("Errore!", "Caricamento dell'immagine fallito.", "error");
        return;
      }
    }

    const updatedData = { ...formState, img: imageUrl };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/users/update/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      const data = await response.json();
      setUser(data.user); 
      getUserFromApi()
      setShowEditModal(false);

      Swal.fire("Successo!", "Utente aggiornato con successo.", "success");
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Errore!", "Aggiornamento dell'utente fallito.", "error");
    }
  };


  const deleteUser = async () => {

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/users/delete/${userId}`,
        {method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      )
      if(!response.ok) {
        console.log("Sorry, something went wrong")
      }
      const data = response.json()
      
    } catch (error) {
      console.error(error || error.message)
      
    }
    finally{
      setLoading(false)
    }
  }



  useEffect(() => {
    if (token) {
      getUserFromApi();
    }
  }, [token, userId]);

  return (
  <>
  <Navbar/>
    <Container className="mt-5">
      <Row>
        <Col sm={12} md={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Img
              variant="top"
              src={user?.img}
              style={{ objectFit: "cover", height: "300px" }}
            />
            <Card.Body>
              <Card.Title>
                {user?.name} {user?.surname}
              </Card.Title>
              <Card.Text>Email: {user?.email}</Card.Text>
              <Card.Text>Role: {user?.role}</Card.Text>
              <div className="d-flex flex-column align-items-center justify-content-center">
              <Button variant="primary" className="mt-3 me-2" onClick={() => setShowEditModal(true)}>
                Edit User
              </Button>
              <Button variant="danger" className="mt-3 me-2" onClick={deleteUser}>
                Delete User
              </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modale per la modifica */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formState.name || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={formState.surname || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formState.email || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formState.role || ""}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formImg">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  
    </>
  );
};

export default UserDetails;