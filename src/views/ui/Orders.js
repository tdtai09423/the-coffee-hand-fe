import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button } from "reactstrap";
import { Form } from "react-bootstrap";
import orderAPI from "../../api/orderApi"; // API orders
import drinksAPI from "../../api/drinksApi"; // API drinks
import usersAPI from "../../api/usersApi"; // API users
import DynamicProjectTable from "../../components/dashboard/DynamicTable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drinksMap, setDrinksMap] = useState({});
  const [usersMap, setUsersMap] = useState({});

  const fetchOrders = async (page, size) => {
    try {
      const response = await orderAPI.getAll(page, size);
      const data = response.data;
      setOrders(data.items || []);
      setPageNumber(data.pageNumber);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách orders:", error);
    }
  };

  const fetchDrinks = async () => {
    try {
      const response = await drinksAPI.getAll(1, 100);
      const drinksArray = response.data.items || [];
      const mapping = {};
      drinksArray.forEach((drink) => {
        mapping[drink.id] = drink.name;
      });
      setDrinksMap(mapping);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách drinks:", error);
    }
  };

  useEffect(() => {
    fetchOrders(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchDrinks();
  }, []);

  // Sau khi lấy orders, load thông tin user cho từng order nếu chưa có trong usersMap
  useEffect(() => {
    orders.forEach((order) => {
      if (!usersMap[order.userId]) {
        usersAPI
          .getUsersById(order.userId)
          .then((response) => {
            const user = response.data;
            const fullName = `${user.firstName} ${user.lastName}`;
            setUsersMap((prev) => ({ ...prev, [order.userId]: fullName }));
          })
          .catch((error) => {
            console.error("Lỗi khi lấy thông tin user:", error);
          });
      }
    });
    // Chỉ cần chạy lại khi orders thay đổi
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.userId.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      header: "Order ID",
      key: "id",
    },
    {
      header: "Date",
      key: "date",
      render: (row) => {
        const dateObj = new Date(row.date);
        return dateObj.toLocaleString();
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => {
        if (row.status === "5") {
          return <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>;
        } else if (row.status === "0") {
          return <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>;
        } else if (row.status === "4") {
          return <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>;
        } else {
          return <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>;
        }
      },
    },
    {
      header: "Total Price",
      key: "totalPrice",
    },
    {
      header: "User", // Thay đổi cột này để hiển thị tên người dùng
      key: "userId",
      render: (row) => <div>{usersMap[row.userId] || "Loading..."}</div>,
    },
    {
      header: "Order Details",
      key: "orderDetails",
      render: (row) => (
        <ul style={{ paddingLeft: "1rem" }}>
          {row.orderDetails?.map((detail) => (
            <li key={detail.id}>
              {drinksMap[detail.drinkId] || detail.drinkId} x ({detail.total}) 
              <div style={{ fontSize: "13px" }}>{detail.note}</div>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const colSizes = [4, 2, 1, 1, 2, 2];

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <div className="d-flex">
            <Input
              type="text"
              placeholder="Search Orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button color="primary" className="ms-2">
              Search
            </Button>
          </div>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Row>
        <Col lg="12">
          <DynamicProjectTable
            data={filteredOrders}
            columns={columns}
            colSizes={colSizes}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="text-nowrap" style={{ minWidth: "150px" }}>
              Rows per page:
            </div>
            <Form.Select
              aria-label="Rows per page"
              className="ms-2"
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
          </div>
          <div>
            <span className="ms-3 me-4">
              Page {pageNumber} of {totalPages || 1}
            </span>
            <Button
              color="primary"
              className="ms-2"
              disabled={pageNumber <= 1 || !hasPreviousPage}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Prev
            </Button>
            <Button
              color="primary"
              className="ms-2"
              disabled={pageNumber >= totalPages || !hasNextPage}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Orders;
