import { Alert } from "react-bootstrap";

const Message = (props) => <Alert variant={props.variant}>{props.children}</Alert>;

Message.defaultProps = { variant: "info" };

export default Message;