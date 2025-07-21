import { Alert } from "react-bootstrap";

export const Message = (props) => <Alert variant={props.variant}>{props.children}</Alert>;

Message.defaultProps = { variant: "info" };
