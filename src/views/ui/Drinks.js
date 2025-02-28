import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
} from "reactstrap";
import categoriesAPI from "../../api/categoriesApi";
import drinksAPI from "../../api/drinksApi";

const Drinks = () => {
  // Danh sách categories và drinks từ API
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  // State cho thêm mới category
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // State cho modal thêm mới Drink
  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [newDrink, setNewDrink] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    isAvailable: true,
  });

  // State hiển thị thông tin drink (modal chi tiết drink)
  const [selectedDrink, setSelectedDrink] = useState(null);

  // State cho modal xác nhận xóa (dùng chung cho category và drink)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: null, // "category" hoặc "drink"
    id: null,
    name: "",
  });

  // Lấy danh sách categories từ API
  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll(1, 100);
      const data = res.data;
      // Thêm category "All Drinks" (id = "all") vào đầu danh sách
      setCategories([{ id: "all", name: "All Drinks" }, ...data.items]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Lấy danh sách drinks từ API
  const fetchDrinks = async () => {
    try {
      const res = await drinksAPI.getAll(1, 100);
      const data = res.data;
      setDrinks(data.items);
    } catch (error) {
      console.error("Error fetching drinks:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDrinks();
  }, []);

  // Xác nhận thêm mới category
  const handleConfirmAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await categoriesAPI.addNewCategories(newCategoryName);
      fetchCategories();
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Hủy việc thêm mới category
  const handleCancelAddCategory = () => {
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  // Lọc drinks theo category đang chọn
  const displayedDrinks =
    activeCategoryId === "all"
      ? drinks
      : drinks.filter(
          (drink) =>
            drink.categoryId?.toLowerCase() === activeCategoryId.toLowerCase()
        );

  // Xử lý thay đổi input trong modal thêm Drink
  const handleNewDrinkChange = (field, value) => {
    setNewDrink((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm log thông tin drink mới
  const logNewDrinkInfo = (drink) => {
    console.log("Thông tin drink mới sẽ được thêm:", drink);
  };

  // Xác nhận thêm Drink
  const handleConfirmAddDrink = async () => {
    if (!newDrink.name.trim() || !newDrink.price || !newDrink.categoryId)
      return;

    logNewDrinkInfo(newDrink);

    try {
      await drinksAPI.addNewDrinks({
        ...newDrink,
        price: parseFloat(newDrink.price),
      });
      fetchDrinks();
      setIsAddingDrink(false);
      setNewDrink({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        isAvailable: true,
      });
    } catch (error) {
      console.error("Error adding drink:", error);
    }
  };

  // Mở modal xác nhận xóa cho category
  const openDeleteConfirmModalForCategory = (category) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: "category",
      id: category.id,
      name: category.name,
    });
  };

  // Mở modal xác nhận xóa cho drink
  const openDeleteConfirmModalForDrink = (drink) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: "drink",
      id: drink.id,
      name: drink.name,
    });
  };

  // Xử lý xác nhận xóa khi nhấn nút Delete trong modal xác nhận
  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirmModal;
    if (type === "category") {
      try {
        await categoriesAPI.deleteCategoriesById(id);
        fetchCategories();
        if (activeCategoryId.toLowerCase() === id.toLowerCase()) {
          setActiveCategoryId("all");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    } else if (type === "drink") {
      try {
        await drinksAPI.deleteDrinksById(id);
        fetchDrinks();
        setSelectedDrink(null);
      } catch (error) {
        console.error("Error deleting drink:", error);
      }
    }
    // Đóng modal xác nhận sau khi xóa
    setDeleteConfirmModal({ isOpen: false, type: null, id: null, name: "" });
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Sidebar Categories */}
      <Col
        md="3"
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRight: "1px solid #ccc",
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
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                cursor: "pointer",
                padding: "5px 10px",
                borderRadius: "4px",
                fontWeight: activeCategoryId === cat.id ? "bold" : "normal",
                color: activeCategoryId === cat.id ? "#fff" : "#000",
                backgroundColor:
                  activeCategoryId === cat.id ? "#000" : "transparent",
              }}
            >
              <span onClick={() => setActiveCategoryId(cat.id)}>
                {cat.name}
              </span>
              {/* Nếu không phải "All Drinks", hiển thị nút xóa */}
              {cat.id !== "all" && (
                <Button
                  color="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteConfirmModalForCategory(cat);
                  }}
                >
                  Delete
                </Button>
              )}
            </li>
          ))}

          {/* Phần thêm mới category */}
          {isAddingCategory ? (
            <li
              style={{
                marginBottom: "10px",
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: "#e0e0e0",
              }}
            >
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
              />
              <div
                style={{
                  marginTop: "5px",
                  display: "flex",
                  gap: "5px",
                }}
              >
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleConfirmAddCategory}
                >
                  Confirm
                </Button>
                <Button
                  color="secondary"
                  size="sm"
                  onClick={handleCancelAddCategory}
                >
                  Cancel
                </Button>
              </div>
            </li>
          ) : (
            <li
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "5px 10px",
                borderRadius: "4px",
                fontWeight: "normal",
                color: "#000",
                backgroundColor: "transparent",
                border: "1px dashed #ccc",
              }}
              onClick={() => setIsAddingCategory(true)}
            >
              + Add new category
            </li>
          )}
        </ul>
      </Col>

      {/* Main Content - Drinks */}
      <Col md="9" style={{ padding: "20px" }}>
        {/* Header Row: Button Add New Drink và Title */}
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Col md="3" style={{ textAlign: "left" }}>
            <h4 style={{ margin: 0 }}>
              {activeCategoryId === "all"
                ? "All Drinks"
                : categories.find(
                    (c) =>
                      c.id.toLowerCase() === activeCategoryId.toLowerCase()
                  )?.name || "Category"}
            </h4>
          </Col>
          <Col md="9" style={{ textAlign: "right" }}>
            <Button
              color="primary"
              onClick={() => setIsAddingDrink(true)}
              style={{ marginRight: "1rem" }}
            >
              Add New Drink
            </Button>
          </Col>
        </Row>

        {/* Danh sách drinks */}
        <Row
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {displayedDrinks.map((drink) => (
            <div
              key={drink.id}
              style={{
                flex: "0 0 20%",
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
                  cursor: "pointer",
                }}
                onClick={() => setSelectedDrink(drink)}
              >
                <img
                  src="https://via.placeholder.com/300x300"
                  alt={drink.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "10px" }}>
                  <h5 style={{ fontSize: "1rem", margin: "0.5rem 0" }}>
                    {drink.name}
                  </h5>
                  <p style={{ margin: 0, color: "#555" }}>
                    {drink.price ? `$${drink.price}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Row>
      </Col>

      {/* Modal thêm mới Drink */}
      <Modal
        isOpen={isAddingDrink}
        toggle={() => setIsAddingDrink(!isAddingDrink)}
      >
        <ModalHeader toggle={() => setIsAddingDrink(false)}>
          Add New Drink
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="drinkName">Name</Label>
            <Input
              id="drinkName"
              type="text"
              value={newDrink.name}
              onChange={(e) => handleNewDrinkChange("name", e.target.value)}
              placeholder="Enter drink name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="drinkDescription">Description</Label>
            <Input
              id="drinkDescription"
              type="textarea"
              value={newDrink.description}
              onChange={(e) =>
                handleNewDrinkChange("description", e.target.value)
              }
              placeholder="Enter drink description"
            />
          </FormGroup>
          <FormGroup>
            <Label for="drinkPrice">Price</Label>
            <Input
              id="drinkPrice"
              type="number"
              value={newDrink.price}
              onChange={(e) => handleNewDrinkChange("price", e.target.value)}
              placeholder="Enter drink price"
            />
          </FormGroup>
          <FormGroup>
            <Label for="drinkCategory">Category</Label>
            <Input
              id="drinkCategory"
              type="select"
              value={newDrink.categoryId}
              onChange={(e) =>
                handleNewDrinkChange("categoryId", e.target.value)
              }
            >
              <option value="">Select a category</option>
              {categories
                .filter((cat) => cat.id !== "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </Input>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={newDrink.isAvailable}
                onChange={(e) =>
                  handleNewDrinkChange("isAvailable", e.target.checked)
                }
              />{" "}
              Is Available
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirmAddDrink}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => setIsAddingDrink(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal hiển thị thông tin drink */}
      {selectedDrink && (
        <Modal isOpen={true} toggle={() => setSelectedDrink(null)}>
          <ModalHeader toggle={() => setSelectedDrink(null)}>
            {selectedDrink.name}
          </ModalHeader>
          <ModalBody>
            <p>
              <strong>Description:</strong> {selectedDrink.description}
            </p>
            <p>
              <strong>Price:</strong> ${selectedDrink.price}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {categories.find((c) => c.id === selectedDrink.categoryId)
                ?.name || "N/A"}
            </p>
            <p>
              <strong>Available:</strong>{" "}
              {selectedDrink.isAvailable ? "Yes" : "No"}
            </p>
          </ModalBody>
          <ModalFooter style={{ justifyContent: "flex-start" }}>
            <Button color="secondary" onClick={() => setSelectedDrink(null)}>
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={() => openDeleteConfirmModalForDrink(selectedDrink)}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Modal xác nhận xóa (cho category hoặc drink) */}
      {deleteConfirmModal.isOpen && (
        <Modal
          isOpen={deleteConfirmModal.isOpen}
          toggle={() =>
            setDeleteConfirmModal({
              ...deleteConfirmModal,
              isOpen: false,
            })
          }
        >
          <ModalHeader
            toggle={() =>
              setDeleteConfirmModal({
                ...deleteConfirmModal,
                isOpen: false,
              })
            }
          >
            Confirm Deletion
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete "{deleteConfirmModal.name}"?
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() =>
                setDeleteConfirmModal({
                  ...deleteConfirmModal,
                  isOpen: false,
                })
              }
            >
              Cancel
            </Button>
            <Button color="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </Row>
  );
};

export default Drinks;
