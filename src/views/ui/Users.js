import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import ProjectTables from "../../components/dashboard/ProjectTable";

const Users = () => {
  return (
    <Row>
      <Col lg="12">
        <ProjectTables />
      </Col>
    </Row>
  );
};

export default Users
