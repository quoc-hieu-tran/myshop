import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card /*, Button*/ } from "react-bootstrap";
import Message from "../components/Message";
import { Loader } from "../components/Loader";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { usePayOrderMutation, useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    isLoading,
    error,
    refetch, // available if you later need to refresh to avoid stale data
  } = useGetOrderDetailsQuery(orderId);
  // Load PayPal client ID from backend
  const {
    data: paypal, // { clientId: '...' }
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();
  // RTK mutation to mark the order as paid
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  // Control PayPal SDK loading state
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  // Current user (if you need it)
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loadingPayPal && !errorPayPal && paypal?.clientId) {
      const loadPayPalScript = () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, loadingPayPal, errorPayPal, paypalDispatch]);

  // Handler function - Create an order on PayPal (for the current order total)
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice, // ensure this is a string/number acceptable to PayPal
            },
          },
        ],
      })
      .then((orderId) => orderId);
  }
  // Approve handler function : capture on PayPal, then mark paid in your backend
  async function onApprove(data, actions) {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId: order._id, details }); // details returned by PayPal
        await refetch(); // refresh UI to show "Paid"
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }
  // Test-only approve Handler: skip PayPal, mark order paid immediately
  async function onApproveTest() {
    try {
      await payOrder({
        orderId: order._id,
        details: { payer: {} }, // minimal shape the backend expects
      });
      await refetch();
      toast.success("Payment successful (test)");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }
  // Error handler for PayPal button flow
  function onError(err) {
    toast.error(err?.message || "PayPal error");
  }

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;
  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        {/* LEFT: details */}
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            {/* Payment */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            {/* Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, idx) => (
                <ListGroup.Item key={idx}>
                  <Row className="align-items-center">
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {/* RIGHT: summary & actions */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Pay Order – to be implemented with PayPal in next lessons */}

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <>
                      <div>
                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                      </div>
                    </>
                  )}
                </ListGroup.Item>
              )}

              {/* Admin-only: Mark as Delivered – later */}
              <ListGroup.Item>{/* Mark as Delivered Placeholder */}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
