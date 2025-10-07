import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice"; // adjust name if different
import { useUpdateProductMutation } from "../slices/productsApiSlice";
const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  // Local form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(""); // upload wired in next videos
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  // Load existing product details
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  // Mutation to update
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  // Hydrate form from loaded product
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price ?? 0);
      setImage(product.image || "");
      setBrand(product.brand || "");
      setCategory(product.category || "");
      setCountInStock(product.countInStock ?? 0);
      setDescription(product.description || "");
    }
  }, [product]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();
      toast.success("Product updated");
      // Ensure latest data in caches / screens
      refetch?.();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to update product");
    }
  };
  return (
    <>
      <Link className="btn btn-light my-3" to="/admin/productlist">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error || "Failed to load product"}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* NAME */}
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            {/* PRICE */}
            <Form.Group className="my-2" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Form.Group>
            {/* IMAGE (placeholder – upload later) */}
            <Form.Group className="my-2" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Image path (upload in next lesson)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Group>

            {/* BRAND */}
            <Form.Group className="my-2" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>
            {/* COUNT IN STOCK */}
            <Form.Group className="my-2" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock count"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
              />
            </Form.Group>
            {/* CATEGORY */}
            <Form.Group className="my-2" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            {/* DESCRIPTION */}
            <Form.Group className="my-2" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
export default ProductEditScreen;
