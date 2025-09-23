import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  // Guard: must have shipping address + payment method completed
  useEffect(() => {
    if (!cart.shippingAddress || !cart.shippingAddress.address) {
      toast.error("Please enter your shipping address first");
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      toast.error("Please select a payment method first");
      navigate("/payment");
    }
  }, [cart.shippingAddress?.address, cart.paymentMethod, navigate]);
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          {/* Left column content will be built next: Shipping, Payment, Items list */}
          Left column
        </Col>
        <Col md={4}>
          {/* Right column will be the order summary + Place Order button */}
          Right column
        </Col>
      </Row>
    </>
  );
}
