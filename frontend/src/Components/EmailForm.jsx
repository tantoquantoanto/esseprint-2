import { Form, Button } from "react-bootstrap";
import "./components-css/emailForm.css";
import { useState } from "react";

const EmailForm = () => {

const [formState, setFormState] = useState({});

const onChangeInput = (e) => {
    const {name, value} = e.target;
    setFormState({
        ...formState,
        [name]: value
    })
}

const onSubmit = async (e) => {
    e.preventDefault()
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/sendEmail`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formState)
    })
    return await response.json()

        
    } catch (error) {
        console.error(error.message)
        
    }
}




  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control onChange={onChangeInput} type="email" name="email" placeholder="Inserisci la tua email" />
      </Form.Group>
      <Form.Group controlId="subject" className="mt-3">
        <Form.Label>Oggetto</Form.Label>
        <Form.Control onChange={onChangeInput} type="text" name="subject" placeholder="Oggetto della tua email" />
      </Form.Group>
      <Form.Group controlId="message" className="mt-3">
        <Form.Label>Messaggio</Form.Label>
        <Form.Control onChange={onChangeInput} as="textarea" name="text" rows={4} placeholder="Scrivi qui il tuo messaggio" />
      </Form.Group>
      <Button variant="primary" className="mt-4" type="submit">
        Invia
      </Button>
    </Form>
  );
};

export default EmailForm;