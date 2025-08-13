import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

interface IUser {
  id: number;
}

const UserDeleteModal = (props: any) => {
  const { dataUser, isOpenDeleteModal, setIsOpenDeleteModal } = props;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      const res = await fetch(`http://localhost:8000/users/${payload.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": " application/json",
        },
      });
      return res.json();
    },
    onSuccess: () => {
      // Optionally, you can refetch users or update the state here
      setIsOpenDeleteModal(false);
      toast.success("Delete user successfully");
      queryClient.invalidateQueries({ queryKey: ["fetchUser"] });
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ id: dataUser?.id });
  };

  return (
    <Modal
      show={isOpenDeleteModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop={false}
      onHide={() => setIsOpenDeleteModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete A User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Delete the user: {dataUser?.email ?? ""}</Modal.Body>
      <Modal.Footer>
        {!mutation.isPending ? (
          <>
            <Button
              variant="warning"
              onClick={() => setIsOpenDeleteModal(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit()}>Confirm</Button>
          </>
        ) : (
          <Button disabled>
            <Spinner as="span" animation="border" size="sm" role="status" />
            &nbsp; deleting...
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
