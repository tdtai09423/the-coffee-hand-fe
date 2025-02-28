import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Table } from "reactstrap";
import { Form } from "react-bootstrap";
import ingredientsAPI from "../../api/ingredientsApi";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  // State phân trang
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Bộ lọc tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const fetchIngredients = async (page, size) => {
    try {
      const response = await ingredientsAPI.getAll(page, size);
      const data = response.data;
      setIngredients(data.items || []);
      setPageNumber(data.pageNumber);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  useEffect(() => {
    fetchIngredients(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  // Lọc ingredient theo tên và id
  const filteredIngredients = ingredients.filter((ing) => {
    const lowerName = ing.name.toLowerCase();
    const lowerId = ing.id.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    return lowerName.includes(lowerSearch) || lowerId.includes(lowerSearch);
  });

  return (
    <div style={{ backgroundColor: "#fff", color: "#000", minHeight: "100vh", padding: "20px" }}>
      <h3 style={{ marginBottom: "20px" }}>Ingredient Management</h3>

      {/* Thanh công cụ: Search + Export + New Ingredient */}
      <Row
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
        className="align-items-center"
      >
        {/* Col trái: Search */}
        <Col md="8" className="d-flex align-items-center gap-2">
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: "#fff", color: "#000", border: "1px solid #ccc" }}
          />
        </Col>
        {/* Col phải: Export + New Ingredient */}
        <Col md="4" className="d-flex justify-content-end gap-2">
          <Button color="secondary" style={{ border: "none" }}>
            Export
          </Button>
          <Button color="warning" style={{ border: "none" }}>
            New Ingredient
          </Button>
        </Col>
      </Row>

      {/* Bảng hiển thị ingredient */}
      <Row>
        <Col>
          <Table responsive style={{ backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" }}>
            <thead style={{ backgroundColor: "#eee" }}>
              <tr>
                <th>
                  <Input type="checkbox" />
                </th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ing) => (
                <tr key={ing.id}>
                  <td>
                    <Input type="checkbox" />
                  </td>
                  <td>{ing.name}</td>
                  <td>{ing.quantity}</td>
                  <td>{ing.price}</td>
                  <td>{ing.id}</td>
                </tr>
              ))}
              {filteredIngredients.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No ingredients found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Footer phân trang */}
      <Row className="mt-3" style={{ alignItems: "center" }}>
        <Col md="6">
          <span>
            Showing{" "}
            {filteredIngredients.length > 0
              ? (pageNumber - 1) * pageSize + 1
              : 0}{" "}
            -{" "}
            {(pageNumber - 1) * pageSize + filteredIngredients.length} of {totalCount} results
          </span>
        </Col>
        <Col md="6" className="d-flex justify-content-end align-items-center" style={{ gap: "10px" }}>
          <span>Rows:</span>
          <Form.Select
            style={{ width: "80px", backgroundColor: "#fff", color: "#000", border: "1px solid #ccc" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPageNumber(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
          <Button
            color="secondary"
            disabled={pageNumber <= 1 || !hasPreviousPage}
            onClick={() => setPageNumber(pageNumber - 1)}
            style={{ border: "none" }}
          >
            Prev
          </Button>
          <Button
            color="secondary"
            disabled={pageNumber >= totalPages || !hasNextPage}
            onClick={() => setPageNumber(pageNumber + 1)}
            style={{ border: "none" }}
          >
            Next
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Ingredients;
