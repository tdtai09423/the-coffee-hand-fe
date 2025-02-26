import React, { useState } from "react";
import { Row, Col } from "reactstrap";

const Drinks = () => {
  // State lưu trữ category được chọn (mặc định là "All Drinks")
  const [activeCategory, setActiveCategory] = useState("All Drinks");

  // Fake data cho categories (bao gồm "All Drinks")
  const categories = [
    { id: 0, name: "All Drinks" },
    { id: 1, name: "Coffee" },
    { id: 2, name: "Tea" },
    { id: 3, name: "Juice" },
    { id: 4, name: "Smoothie" },
  ];

  // Fake data cho drinks
  const drinks = [
    {
      id: 1,
      name: "Iced Coffee",
      price: "$5.00",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 2,
      name: "Bubble Milk Tea",
      price: "$4.50",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 3,
      name: "Watermelon Juice",
      price: "$3.00",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 4,
      name: "Mango Smoothie",
      price: "$6.00",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 5,
      name: "Lemon Tea",
      price: "$4.00",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 6,
      name: "Espresso",
      price: "$3.50",
      image: "https://via.placeholder.com/300x300",
    },
    // Thêm dữ liệu nếu cần...
  ];

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Sidebar Categories */}
      <Col
        md="3"
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRight: "1px solid #ccc", // Đường kẻ dọc phân chia
        }}
      >
        <h5>Categories</h5>
        <ul
          style={{
            listStyleType: "none",
            paddingLeft: 0,
            marginTop: "1rem",
          }}
        >
          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "5px 10px",
                borderRadius: "4px",
                fontWeight: activeCategory === cat.name ? "bold" : "normal",
                color: activeCategory === cat.name ? "#fff" : "#000",
                backgroundColor: activeCategory === cat.name ? "#000" : "transparent",
              }}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </Col>

      {/* Main Content - Drinks */}
      <Col md="9" style={{ padding: "20px" }}>
        <h4>Drinks</h4>
        <Row
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {drinks.map((drink) => (
            <div
              key={drink.id}
              style={{
                flex: "0 0 20%", // Mỗi item chiếm 20% -> 5 items trên 1 hàng
                maxWidth: "20%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  textAlign: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={drink.image}
                  alt={drink.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "10px" }}>
                  <h5 style={{ fontSize: "1rem", margin: "0.5rem 0" }}>{drink.name}</h5>
                  <p style={{ margin: 0, color: "#555" }}>{drink.price}</p>
                </div>
              </div>
            </div>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Drinks;
