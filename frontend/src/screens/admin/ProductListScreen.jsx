import React from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Loader } from "../../components/Loader";
import Message from "../../components/Message";
// Reuse the public getProducts endpoint for now
import { useGetProductsQuery } from "../../slices/productsApiSlice";
const ProductListScreen = () => {
  // Fetch products (reusing the public endpoint)
  const { data: products, isLoading, error } = useGetProductsQuery();
  // Delete handler (stub for now; wired in upcoming lessons)
  const deleteHandler = (id) => {
    console.log("delete:", id);
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
          <Button className="my-3 btn-sm">
            <FaEdit className="me-2" />
            Create Product
          </Button>
        </Col>
      </Row>
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
