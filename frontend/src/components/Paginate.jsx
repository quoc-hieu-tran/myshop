import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { LinkContainer } from "react-router-bootstrap";
const Paginate = ({ pages, page, isAdmin = false }) => {
  if (!pages || pages <= 1) return null;
  return (
    <Pagination className="my-3">
      {[...Array(pages).keys()].map((x) => {
        const pageNumber = x + 1;
        const to = !isAdmin ? `/page/${pageNumber}` : `/admin/productlist/${pageNumber}`;
        return (
          <LinkContainer key={pageNumber} to={to}>
            <Pagination.Item active={pageNumber === page}>{pageNumber}</Pagination.Item>
          </LinkContainer>
        );
      })}
    </Pagination>
  );
};
export default Paginate;
