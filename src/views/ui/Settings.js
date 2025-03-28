import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [machines, setMachines] = useState([]);
  const [modal, setModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);

  const initialMachineState = {
    _id: "",
    machine_name: "",
    ingredient: "Coffee beans",
    parameters: [
      {
        mode: "grind",
        parameters_required: ["grind_size", "duration"]
      },
      {
        mode: "brew",
        parameters_required: ["temperature", "pressure", "volume"]
      }
    ]
  };

  const [formData, setFormData] = useState(initialMachineState);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormData(initialMachineState);
      setEditingMachine(null);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await axios.get("/api/machines");
      setMachines(response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMachine) {
        await axios.put(`/api/machines/${editingMachine._id}`, formData);
      } else {
        await axios.post("/api/machines", formData);
      }
      fetchMachines();
      toggle();
    } catch (error) {
      console.error("Error saving machine:", error);
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData(machine);
    toggle();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this machine?")) {
      try {
        await axios.delete(`/api/machines/${id}`);
        fetchMachines();
      } catch (error) {
        console.error("Error deleting machine:", error);
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h5">Coffee Machine Management</CardTitle>
                <Button color="primary" onClick={toggle}>
                  Add New Machine
                </Button>
              </div>

              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Machine Name</th>
                    <th>Ingredient</th>
                    <th>Modes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((machine) => (
                    <tr key={machine._id}>
                      <td>{machine.machine_name}</td>
                      <td>{machine.ingredient}</td>
                      <td>
                        {machine.parameters.map((param) => (
                          <div key={param.mode}>
                            <strong>{param.mode}:</strong>{" "}
                            {param.parameters_required.join(", ")}
                          </div>
                        ))}
                      </td>
                      <td>
                        <Button
                          color="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(machine)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(machine._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                  {editingMachine ? "Edit Machine" : "Add New Machine"}
                </ModalHeader>
                <Form onSubmit={handleSubmit}>
                  <ModalBody>
                    <FormGroup>
                      <Label for="machineName">Machine Name</Label>
                      <Input
                        id="machineName"
                        value={formData.machine_name}
                        onChange={(e) =>
                          setFormData({ ...formData, machine_name: e.target.value })
                        }
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="ingredient">Ingredient</Label>
                      <Input
                        id="ingredient"
                        value={formData.ingredient}
                        onChange={(e) =>
                          setFormData({ ...formData, ingredient: e.target.value })
                        }
                        required
                      />
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit">
                      {editingMachine ? "Update" : "Save"}
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
