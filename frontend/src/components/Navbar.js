import { useRouter } from 'next/router';
import { Navbar, Nav } from 'react-bootstrap';

const NavBar = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand onClick={() => router.push('/')}>Next.js Auth App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={handleLogin}>Login</Nav.Link>
          <Nav.Link onClick={handleSignUp}>Sign Up</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
