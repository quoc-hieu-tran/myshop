import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import {Loader} from '../components/Loader';
import Message from '../components/Message';
export default function ProfileScreen() {
  const dispatch = useDispatch();
// Local form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
// Logged-in user info from global state
  const { userInfo } = useSelector((state) => state.auth);
// RTK Query mutation hook
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
// Prefill name & email when we have userInfo
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo]);
// Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        // only send password if user typed one
        ...(password ? { password } : {}),
      }).unwrap();
// Update global auth state so header/name/email react immediately
      dispatch(setCredentials(res));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Update failed');
    }
  };
return (
    <Row>
      {/* Left column: Profile form */}
      <Col md={3}>
        <h2>My Profile</h2>
{/* You may show auth-related errors here if you have them */}
        {/* <Message variant="danger">{errorAuth}</Message> */}
<Form onSubmit={submitHandler} className="mt-3">
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
<Form.Group controlId="email" className="my-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
<Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
<Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
<Button type="submit" variant="primary" className="mt-2">
            Update
          </Button>
{loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
{/* Right column: Orders list placeholder (wired next lesson) */}
      <Col md={9}>
        <h2>My Orders</h2>
        <Message>Orders will appear here in the next step.</Message>
      </Col>
    </Row>
  );
}
