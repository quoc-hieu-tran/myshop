import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import Product from "../components/Product";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import { Loader } from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
const ProductScreen = (props) => {
  const { id: productId } = useParams();

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>{product.name}</h3>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating text={`${product.numReviews} reviews`} value={product.rating}></Rating>
                </ListGroupItem>
                <ListGroupItem>Description: {product.description}</ListGroupItem>

                <ListGroupItem>{product.countInStock} in stock</ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <Row>
                      <Col>
                        <strong>Price: </strong>
                      </Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.countInStock > 0 ? "In stock" : "Out of stock"}</Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      {product.countInStock > 0 && (
                        <ListGroupItem>
                          <Row>
                            <Col>Qty</Col>
                            <Col>
                              <Form.Control as={"select"} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                {[...Array(product.countInStock).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))}
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroupItem>
                      )}
                      <Button
                        className="btn-block"
                        type="button"
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        <strong>Add To Cart</strong>
                      </Button>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
