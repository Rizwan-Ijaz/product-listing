import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { Pagination } from "./components/Pagination";

const API =
  "http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline";

function App() {
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [searchStr, setSearchStr] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const products = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    const slicedList = data.slice(firstPageIndex, lastPageIndex);

    if (searchStr) {
      return slicedList.filter(({ name }) =>
        name.toLowerCase().includes(searchStr.trim())
      );
    }
    return slicedList;
  }, [currentPage, pageSize, data, searchStr]);

  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <Container>
      <div className="mt-5 d-flex" style={{ gap: 10 }}>
        <Form.Group className="mb-3" style={{ width: 250 }}>
          <Form.Label>Search</Form.Label>
          <Form.Control
            size="sm"
            placeholder="Type here to search"
            onChange={(e) => setSearchStr(e.target.value.toLowerCase())}
          />
        </Form.Group>
        <Form.Group style={{ width: 200 }}>
          <Form.Label>Sort By</Form.Label>
          <Form.Select onChange={(e) => setSortBy(e.target.value)} size="sm">
            <option value="name">Name</option>
            <option value="price">Price</option>
          </Form.Select>
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end">
        <Pagination
          totalCount={data.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onChange={handlePaginationChange}
        />
      </div>

      <Row className="g-4">
        {products
          .sort((a, b) => {
            let firstValue = a[sortBy];
            let secondValue = b[sortBy];

            if (sortBy === "price") {
              firstValue = Number(a[sortBy]);
              secondValue = Number(b[sortBy]);
            }
            if (firstValue < secondValue) return -1;
            if (firstValue > secondValue) return 1;
            return 0;
          })
          .map(({ id, image_link, name, description, rating, price }) => (
            <Col md={4} key={id}>
              <Card>
                <div className="text-center">
                  <img src={image_link} height={150} alt="Product" />
                </div>
                <Card.Body>
                  <Card.Title>{name}</Card.Title>
                  <Card.Text>
                    {description.length > 110
                      ? description.substring(0, 110) + " ..."
                      : description}
                  </Card.Text>
                  <pre>Ratings {rating || 0}</pre>
                  <h5>${price}</h5>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default App;
