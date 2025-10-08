import React from "react";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTrash, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { Loader } from "../../components/Loader";
import Message from "../../components/Message";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  // Delete handler (stub; wired in the following step)
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      // quick confirm
      try {
        await deleteUser(id).unwrap();
        // If you DIDN’T add tags above, keep this manual refresh:
        await refetch();
        toast.success("User deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error || "Failed to delete user");
      }
    }
  };
  return (
    <>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error || "Failed to load users"}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loadingDelete && <Loader />}
            {users?.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>{user.isAdmin ? <FaCheck style={{ color: "green" }} /> : <FaTimes style={{ color: "red" }} />}</td>
                <td>
                  {/* Edit (form comes in a later lesson) */}
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm me-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  {/* Delete (wired in lesson 13) */}
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                    <FaTrash style={{ color: "white" }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default UserListScreen;
