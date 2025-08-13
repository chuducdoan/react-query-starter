import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

interface IUser {
  id: number;
  email: string;
  name: string;
}

const UserEditModal = (props: any) => {
  const queryClient = useQueryClient();
  const { isOpenUpdateModal, setIsOpenUpdateModal, dataUser } = props;
  const [id, setId] = useState();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (dataUser?.id) {
      setId(dataUser?.id);
      setEmail(dataUser?.email);
      setName(dataUser?.name);
    }
  }, [dataUser]);

  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      const res = await fetch(`http://localhost:8000/users/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email: payload.email,
          name: payload.name,
        }),
        headers: {
          "Content-Type": " application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      // Optionally, you can refetch users or update the state here
      setIsOpenUpdateModal(false);
      setEmail("");
      setName("");
      toast.success("Update user successfully");
      queryClient.invalidateQueries({ queryKey: ["fetchUser"] });
    },
  });

  const handleSubmit = () => {
    if (!email) {
      alert("email empty");
      return;
    }
    if (!name) {
      alert("name empty");
      return;
    }
    if (!dataUser?.id) return;
    mutation.mutate({ email, name, id: dataUser.id });
  };

  return (
    <>
      <Modal
        show={isOpenUpdateModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={false}
        onHide={() => setIsOpenUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update A User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
          </FloatingLabel>
          <FloatingLabel label="Name">
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          {!mutation.isPending ? (
            <>
              <Button
                variant="warning"
                onClick={() => setIsOpenUpdateModal(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={() => handleSubmit()}>Confirm</Button>
            </>
          ) : (
            <Button disabled>
              <Spinner as="span" animation="border" size="sm" role="status" />
              &nbsp; saving...
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserEditModal;
