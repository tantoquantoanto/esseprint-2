import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LucidePlane, LucideHome, LucideUser, MenuIcon, LucideFacebook, LucideTwitter, LucideInstagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useSession from "../../../hooks/useSession";
import SearchInput from "../SearchInput";

const NavBar = ({ setShowApproved, onSearch, showApproved }) => {
  const session = useSession();  
  const userId = session ? session.userId : null;
  const role = session ? session.role : null;
  const location = useLocation()

  const handleLogOut = () => {
    localStorage.removeItem("Authorization");
    window.location.href = "/";
  };

  const isAdmin = role ? role === "admin" : false;

  return (
    <Navbar   bg="light" variant="light" expand="lg" sticky="top" className="shadow-sm d-flex align-items-center justify-content-center p-3">
      <Container fluid >
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-primary">
         Esseprint
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center justify-content-center">
          <Nav.Link 
              as={Link} 
              to={"/"} 
              className="text-dark"
            >
              <LucideHome size={20} className="me-1" /> Home
            </Nav.Link>

            {session && (
             <NavDropdown title={<span><LucidePlane size={20} className="me-1" /> Tutti i prodotti</span>} id="destinations-dropdown">
               <NavDropdown.Item as={Link} to="/scatole">Scatole</NavDropdown.Item>
               <NavDropdown.Item as={Link} to="/shopper">Shopper</NavDropdown.Item>
               <NavDropdown.Item as={Link} to="/tshirt">T-shirt</NavDropdown.Item>
               <NavDropdown.Item as={Link} to="/felpe">Felpe</NavDropdown.Item>

                        
           </NavDropdown>
            )}
            
            

            {!session && (
              
              <NavDropdown title={<span><MenuIcon size={20} className="me-1" /> Menu </span>} id="menu-dropdown">
              <NavDropdown.Item as={Link} to="/login" >Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/chi-siamo">Chi siamo</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/contatti">Contatti</NavDropdown.Item> 
              <NavDropdown.Item as={Link} to="/privacy">Privacy Policy</NavDropdown.Item>                
            </NavDropdown>
            )}

            {session && !isAdmin && (
              <>
              <Nav.Link as={Link} to="/contatti" className="text-dark">
                Contatti
              </Nav.Link>
               <Nav.Link as={Link} to="/chi-siamo" className="text-dark">
               Chi Siamo
             </Nav.Link>
             </>
            )}

            {session && !isAdmin && (
              <NavDropdown title={<span><LucideUser size={20} className="me-1 text-dark" /> Profilo</span>} id="profile-dropdown">
                <NavDropdown.Item as={Link} to={`/users/${userId}`}>Il mio profilo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favourite-products">I miei prodotti preferiti</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}

            {session && isAdmin && (
              <NavDropdown title={<span><LucideUser size={20} className="me-1 text-dark" /> Profilo</span>} id="profile-dropdown">
                <NavDropdown.Item as={Link} to={`/users/${userId}`}>Il mio profilo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={`/create-new-product`}>Crea un nuovo prodotto </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}

            {!session && (
              <Nav.Link as={Link} to="/create-new-users" className="text-dark">
                Registrati
              </Nav.Link>
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;