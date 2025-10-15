import { useState } from "react";
import { Form, Button, FormControl } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
const SearchBox = () => {
  const navigate = useNavigate();
  // read any existing keyword from the URL to prefill the input
  const { keyword: urlKeyword = "" } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword);
  const submitHandler = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) {
      navigate(`/search/${q}`);
    } else {
      navigate("/");
    }
    // clear the input after navigating
    setKeyword("");
  };
  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <FormControl
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products"
        className="me-2 ms-5"
      />
      <Button type="submit" variant="outline-light" className="px-3">
        Search
      </Button>
    </Form>
  );
};
export default SearchBox;
