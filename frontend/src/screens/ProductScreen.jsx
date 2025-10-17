import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import Product from "../components/Product";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import { Loader } from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [qty, setQty] = useState(1);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch(); // refresh product details (and reviews)
      toast.success("Review submitted");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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
          <Meta
            title={product.name}
            description={product.description}
            keywords={`${product.brand}, ${product.category}`}
          />
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
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product?.reviews?.length === 0 && <Message>No reviews</Message>}
              <ListGroup variant="flush">
                {product?.reviews?.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt?.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Review</h2>
                  {loadingProductReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary" disabled={loadingProductReview} className="mt-2">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>Please sign in to write a review</Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
