import React from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Loader } from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
// Reuse the public getProducts endpoint for now
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice";
const ProductListScreen = () => {
  // Fetch products (reusing the public endpoint)
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  //Handlers for Buttons
  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct().unwrap(); // no payload; server fills sample fields
        // If not using tags, manually refresh the list:
        await refetch();
        toast.success("Sample product created");
      } catch (err) {
        toast.error(err?.data?.message || err.error || "Failed to create product");
      }
    }
  };
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        // If not using tags, manually refresh:
        await refetch();
        toast.success("Product deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error || "Failed to delete product");
      }
    }
  };

  return (
    <>
      {/* Top row: title + Create Product button */}
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          {/* Create Product button (functionality will come later) */}
          <Button className="my-3 btn-sm" onClick={createProductHandler}>
            <FaEdit className="me-2" />
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {/* Content: loading / error / table */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error || "Failed to load products"}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    {/* Edit */}
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm me-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    {/* Delete (stub) */}
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Pagination placeholder (we’ll add real pagination & search later) */}
          {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
