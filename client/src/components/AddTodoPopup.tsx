import React from 'react'
import { Modal, Button, Input } from 'semantic-ui-react'
import { TodosState } from './Todos'

interface AddTodoPopupProps {
  onClose: () => any
  addTodo: () => any
  show: boolean
  state: TodosState
  setState: any
}

const AddTodoPopup: React.FC<AddTodoPopupProps> = ({
  addTodo,
  onClose,
  show,
  state,
  setState
}) => {
  return (
    <Modal size="mini" open={show} onClose={() => onClose()}>
      <Modal.Header>Add Todo</Modal.Header>
      <Modal.Content>
        <Input
          placeholder="Input Todo Content..."
          value={state.newTodoName}
          fluid
          onChange={(e) => setState({ newTodoName: e.target.value })}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => onClose()}>
          No
        </Button>
        <Button positive onClick={() => addTodo()}>
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default AddTodoPopup
