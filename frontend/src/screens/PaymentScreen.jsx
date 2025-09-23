import { useEffect, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Pull existing checkout state
  const { shippingAddress, paymentMethod: storedMethod } = useSelector((state) => state.cart);
  // Default to stored method if present, else PayPal
  const [paymentMethod, setPaymentMethod] = useState(storedMethod || "PayPal");
  // If user hasn’t completed Shipping, send them back
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col className="mt-2">
            <Form.Check
              type="radio"
              className="my-2"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              label="PayPal or Credit Card"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {/* Add more options later (e.g., Stripe) */}
            {/* <Form.Check ... value="Stripe" label="Stripe" /> */}
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
