import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Form } from "react-bootstrap";
import classnames from "classnames"; // Nếu bạn muốn toggle class active cho NavLink
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

  // Các state lọc dữ liệu
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Thanh điều hướng status (thay thế cho All, Pickup, Return)
  const [statusTab, setStatusTab] = useState("all"); // all, process, finish

  const [drinksMap, setDrinksMap] = useState({});
  const [usersMap, setUsersMap] = useState({});

  // Lấy danh sách orders
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

  // Lấy danh sách drinks
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
  }, [orders]);

  // Filter dữ liệu theo searchTerm, date range, và statusTab
  const filteredOrders = orders.filter((order) => {
    // Tìm kiếm theo tên user (từ usersMap)
    const fullName = usersMap[order.userId]
      ? usersMap[order.userId].toLowerCase()
      : "";
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchLower || fullName.includes(searchLower) || order.id.toLowerCase().includes(searchLower);

    // Khoảng thời gian
    const orderDate = new Date(order.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);

    // Trạng thái theo tab
    let matchesTab = true;
    if (statusTab === "process") {
      // Giả sử status = "0" là đang xử lý
      matchesTab = order.status === "0";
    } else if (statusTab === "finish") {
      // Giả sử status = "4" là hoàn thành
      matchesTab = order.status === "4";
    }
    // statusTab === "all" => không lọc gì thêm

    return matchesSearch && matchesDate && matchesTab;
  });

  // Các cột cho bảng
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
          return (
            <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
          );
        } else if (row.status === "0") {
          return (
            <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
          );
        } else if (row.status === "4") {
          return (
            <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
          );
        } else {
          return (
            <span className="p-2 bg-secondary rounded-circle d-inline-block ms-3"></span>
          );
        }
      },
    },
    {
      header: "Total Price",
      key: "totalPrice",
    },
    {
      header: "User",
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

  // Tỷ lệ chia cột (tùy chỉnh theo giao diện)
  const colSizes = [3, 2, 1, 1, 2, 3];

  return (
    <div>
      {/* Thanh filter trên cùng */}
      <Row className="align-items-center mb-3">
        <Col md={4}>
          <Input
            type="text"
            placeholder="Search by any order parameter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>

        {/* Ví dụ: 1 input cho start date, 1 input cho end date 
            Hoặc bạn có thể dùng 1 date range picker nếu muốn */}
        <Col md={2}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
        </Col>
        <Col md={2}>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </Col>

        {/* Department (placeholder) */}
        <Col md={2}>
          <Form.Select>
            <option>Department</option>
            <option value="dep1">Department 1</option>
            <option value="dep2">Department 2</option>
          </Form.Select>
        </Col>

        {/* Saved filters, More filters (placeholder) */}
        <Col md={2} className="d-flex justify-content-end">
          <Button color="light" className="me-2">
            Saved filters (0)
          </Button>
          <Button color="light">More filters</Button>
        </Col>
      </Row>

      {/* Thanh điều hướng quản lý status (All, Process, Finish) */}
      <Nav tabs className="mb-3">
        <NavItem>
          <NavLink
            className={classnames({ active: statusTab === "all" })}
            onClick={() => setStatusTab("all")}
            style={{ cursor: "pointer" }}
          >
            All
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: statusTab === "process" })}
            onClick={() => setStatusTab("process")}
            style={{ cursor: "pointer" }}
          >
            Process
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: statusTab === "finish" })}
            onClick={() => setStatusTab("finish")}
            style={{ cursor: "pointer" }}
          >
            Finish
          </NavLink>
        </NavItem>
      </Nav>

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

      {/* Phân trang */}
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
