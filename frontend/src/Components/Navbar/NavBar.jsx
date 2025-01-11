import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LucidePlane, LucideHome, LucideUser, MenuIcon, LucideFacebook, LucideTwitter, LucideInstagram, LucideShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useSession from "../../../hooks/useSession";
import SearchInput from "../SearchInput";
import { useState } from "react";
import SideCart from "../SideCart";

const NavBar = ({ setShowApproved, onSearch, showApproved }) => {
  const session = useSession();  
  const userId = session ? session.userId : null;
  const role = session ? session.role : null;
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);  

  const handleLogOut = () => {
    localStorage.removeItem("Authorization");
    window.location.href = "/";
  };

  const isAdmin = role ? role === "admin" : false;

  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top" className="shadow-sm d-flex align-items-center justify-content-center p-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-primary">
          Esseprint
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center justify-content-center">
            <Nav.Link as={Link} to={"/"} className="text-dark">
              <LucideHome size={20} className="me-1" /> Home
            </Nav.Link>
           
            {!session && (
              <NavDropdown title={<span><MenuIcon size={20} className="me-1" /> Menu </span>} id="menu-dropdown">
                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/create-new-user">Registrati</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/chi-siamo">Chi siamo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/contatti">Contatti</NavDropdown.Item> 
                <NavDropdown.Item as={Link} to="/privacy">Privacy Policy</NavDropdown.Item>                
              </NavDropdown>
            )}

            {session && !isAdmin && (
              <>
                <Nav.Link as={Link} to="/contatti" className="text-dark">Contatti</Nav.Link>
                <Nav.Link as={Link} to="/chi-siamo" className="text-dark">Chi Siamo</Nav.Link>
                <Nav.Link as={Link} to="/privacy" className="text-dark">Privacy Policy</Nav.Link>
              </>
            )}

            {session && !isAdmin && (
              <><NavDropdown title={<span><LucideUser size={20} className="me-1 text-dark" /> Profilo</span>} id="profile-dropdown">
                <NavDropdown.Item as={Link} to={`/users/${userId}`}>Il mio profilo</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
              </NavDropdown>
             </>
            )}

            {session && isAdmin && (
              <NavDropdown title={<span><LucideUser size={20} className="me-1 text-dark" /> Profilo</span>} id="profile-dropdown">
                <NavDropdown.Item as={Link} to={`/users/${userId}`}>Il mio profilo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={`/create-new-product`}>Crea un nuovo prodotto</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}

            {!session && (
              <Nav.Link as={Link} to="/create-new-users" className="text-dark">Registrati</Nav.Link>
            )}

            <SearchInput/>
          </Nav>

          <Nav className="ms-3 d-flex align-items-center">
            <Nav.Link href="https://facebook.com" className="text-primary">
              <LucideFacebook size={20} />
            </Nav.Link>
            <Nav.Link href="https://twitter.com" className="text-primary">
              <LucideTwitter size={20} />
            </Nav.Link>
            <Nav.Link href="https://instagram.com" className="text-primary">
              <LucideInstagram size={20} />
            </Nav.Link>
            {session && !isAdmin && (
              <Nav.Link onClick={() => setShowCart(true)} className="text-primary">
              <LucideShoppingCart size={30} />
            </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

     
      <SideCart show={showCart} setShow={setShowCart} userId={userId} />
    </Navbar>
  );
};

export default NavBar;