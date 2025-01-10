import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2"; 


const NewUsersForm = () => {
  const [formState, setFormState] = useState({});
  const [file, setFile] = useState(null);

  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("img", fileToUpload);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/users/upload`, {
        method: "POST",
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        const uploadedFile = await uploadFile(file);
        const postFormState = {
          ...formState,
          img: uploadedFile.img,
        };

        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postFormState),
        });
        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "User Created",
            text: "The user has been created successfully!",
          }).then(() => {
            window.location.href = "/"; 
          });
        } else {
          
          Swal.fire({
            icon: "error",
            title: "Creation Failed",
            text: result.message || "An error occurred during user creation.",
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: "An error occurred during user creation.",
        });
      }
    }
  };

  return (
    <>
    <Container>
      <Row className="d-flex align-items-center justify-content-center">
        <Col sm={12} md={6}>
          <Form onSubmit={onSubmit} className="mt-5">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={handleInput}
                  type="text"
                  name="name"
                  placeholder="Enter name"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formSurname">
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  onChange={handleInput}
                  type="text"
                  name="surname"
                  placeholder="Enter surname"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={handleInput}
                type="email"
                name="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={handleInput}
                type="text"
                name="username"
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleInput}
                type="password"
                name="password"
                placeholder="Enter password"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" onChange={handleInput}>
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formImg">
              <Form.Label>IMG</Form.Label>
              <Form.Control
                onChange={onChangeFile}
                type="file"
                name="img"
                placeholder="Enter img Url"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default NewUsersForm;