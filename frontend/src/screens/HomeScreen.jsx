import React from "react";
import { Col, Row } from "react-bootstrap";
import products from "../products";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useParams } from "react-router-dom";

const HomeScreen = (props) => {
  const { pageNumber = "1" } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });

  return isLoading ? (
    <h2>Loading</h2>
  ) : error ? (
    <div>{error?.data?.message || error.error}</div>
  ) : (
    <>
      <h1>Latest Product</h1>
      <Row>
        {data?.products?.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product}></Product>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
