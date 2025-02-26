import {
  Row,
  Col
} from "reactstrap";
import SalesChart from "../../components/dashboard/SalesChart";

const Reports = () => {
  return (
    <Row>
      <Col>
        <SalesChart />
      </Col>
    </Row>
  );
};

export default Reports;
