import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call for authentication (replace with actual API call)
    const loginSuccess = await fakeApiLogin(email, password);
    if (loginSuccess) {
      // Redirect to the desired page after successful login
      router.push('/app/page');
    } else {
      // Handle login failure (show error message, etc.)
      console.error('Login failed');
    }
  };

  const fakeApiLogin = async (email, password) => {
    // Replace with actual authentication logic
    // Simulate a delay for API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate successful login (always returns true in this example)
    return true;
  };

  return (
    <Layout>
      <Container>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default Login;
