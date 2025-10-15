import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {Loader} from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../slices/usersApiSlice";
const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  // local form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  // fetch existing user
  const {
    data: user,
    isLoading,
    error,
    refetch, // so we can refresh after update if desired
  } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  // hydrate form when user data arrives
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setIsAdmin(Boolean(user.isAdmin));
    }
  }, [user]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin }).unwrap();
      toast.success("User updated");
      // optional extra: ensure freshest data locally
      refetch?.();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update user");
    }
  };
  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error || "Failed to load user"}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* NAME */}
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            {/* EMAIL */}
            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            {/* IS ADMIN */}
            <Form.Group className="my-2" controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3 w-100">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};
export default UserEditScreen;
