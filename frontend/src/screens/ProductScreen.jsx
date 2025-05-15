import React from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from "react-bootstrap";
import Rating from "../components/Rating";
import products from "../products";
import Product from "../components/Product";

const ProductScreen = (props) => {
  const { id: productId } = useParams();
  const product = products.find((product) => product._id === productId);
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
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
                  <Button className="btn-block" type="button" disabled={product.countInStock === 0}>
                    <strong>Add to cart</strong>
                  </Button>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
