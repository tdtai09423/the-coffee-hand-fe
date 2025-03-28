import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
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
  Spinner
} from "reactstrap";
import { useState, useEffect } from "react";
import machineAPI from "../../api/machineApi";

const Settings = () => {
  const [machines, setMachines] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);

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

  const fetchMachines = async () => {
    setIsLoading(true);
    try {
      const response = await machineAPI.getAll(pageNumber, pageSize);
      const data = response.data;
      setMachines(data.items || []);
      setPageNumber(data.pageNumber);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, [pageNumber, pageSize]);

  const filteredMachines = machines.filter((machine) => {
    const lowerName = machine.machine_name.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    return lowerName.includes(lowerSearch);
  });

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormData(initialMachineState);
      setEditingMachine(null);
    }
  };

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMachine) {
        await machineAPI.update(editingMachine._id, formData);
      } else {
        await machineAPI.create(formData);
      }
      fetchMachines();
      toggle();
    } catch (error) {
      console.error("Error saving machine:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData(machine);
    toggle();
  };

  const handleDelete = (machine) => {
    setMachineToDelete(machine);
    toggleDeleteModal();
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await machineAPI.delete(machineToDelete._id);
      toggleDeleteModal();
      fetchMachines();
      setMachineToDelete(null);
    } catch (error) {
      console.error("Error deleting machine:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", color: "#000", minHeight: "100vh", padding: "20px" }}>
      <h3 style={{ marginBottom: "20px" }}>Coffee Machine Management</h3>

      <Row
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
        className="align-items-center"
      >
        <Col md="8" className="d-flex align-items-center gap-2">
          <Input
            type="text"
            placeholder="Search machines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: "#fff", color: "#000", border: "1px solid #ccc" }}
          />
        </Col>
        <Col md="4" className="d-flex justify-content-end gap-2">
          <Button color="warning" style={{ border: "none" }} onClick={toggle}>
            New Machine
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table responsive style={{ backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" }}>
            <thead style={{ backgroundColor: "#eee" }}>
              <tr>
                <th>Machine Name</th>
                <th>Ingredient</th>
                <th>Modes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <Spinner color="primary" />
                  </td>
                </tr>
              ) : (
                <>
                  {filteredMachines.map((machine) => (
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
                          color="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(machine)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(machine)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredMachines.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No machines found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-3" style={{ alignItems: "center" }}>
        <Col md="6">
          <span>
            Showing {filteredMachines.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} -{" "}
            {(pageNumber - 1) * pageSize + filteredMachines.length} of {totalCount} results
          </span>
        </Col>
        <Col md="6" className="d-flex justify-content-end align-items-center" style={{ gap: "10px" }}>
          <span>Rows:</span>
          <Input
            type="select"
            style={{ width: "80px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPageNumber(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Input>
          <Button
            color="secondary"
            disabled={pageNumber <= 1 || !hasPreviousPage || isLoading}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Prev
          </Button>
          <Button
            color="secondary"
            disabled={pageNumber >= totalPages || !hasNextPage || isLoading}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>

      {/* Add/Edit Machine Modal */}
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
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : (editingMachine ? "Update" : "Save")}
            </Button>
            <Button color="secondary" onClick={toggle} disabled={isSubmitting}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete machine "{machineToDelete?.machine_name}"?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete} disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Settings;
