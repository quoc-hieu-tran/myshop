import React from "react";
import { Col, Row } from "react-bootstrap";
import products from "../products";
import Product from "../components/Product";
import { useState, useEffect } from "react";
import axios from "axios";

const HomeScreen = (props) => {
  const [products, setProducts] = useState([]); //initialize "products" as an empty array
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/products");
      console.log(response.data);

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <h1>Latest Product</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product}></Product>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
