import React from 'react'
import { Modal, Button } from 'semantic-ui-react'

interface DeleteConfirmationProps {
  onClose: () => any
  deleteTodo: () => any
  show: boolean
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  deleteTodo,
  onClose,
  show
}) => {
  return (
    <Modal size="mini" open={show} onClose={() => onClose()}>
      <Modal.Header>Delete Todo</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this todo item?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={() => onClose()}>
          No
        </Button>
        <Button negative onClick={() => deleteTodo()}>
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default DeleteConfirmation
