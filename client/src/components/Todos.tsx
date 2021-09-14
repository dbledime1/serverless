import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Modal
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import AddTodoPopup from './AddTodoPopup'
import DeleteConfirmation from './DeleteConfirmation'

interface TodosProps {
  auth: Auth
  history: History
}

export interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
  deleteConfirmation: boolean
  activeTodo: null | Todo
  todoPopup: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    deleteConfirmation: false,
    activeTodo: null,
    todoPopup: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async () => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        createdAt: new Date().toString(),
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: '',
        todoPopup: false
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter((todo) => todo.todoId !== todoId),
        deleteConfirmation: false,
        activeTodo: null
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e: unknown) {
      if (e instanceof Error) {
        // console.log("ERROR IN GET TODOS ---- ", e)
        alert(`Failed to fetch todos: ${e.message}`)
      }
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button
            icon
            color="teal"
            labelPosition="left"  
            onClick={() => this.setState({ ...this.state, todoPopup: true })}
          >
            <Icon name="pencil" />
            New Task
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  onCloseDelete() {
    this.setState({
      ...this.state,
      deleteConfirmation: false,
      activeTodo: null
    })
  }

  onCloseAdd() {
    this.setState({
      ...this.state,
      todoPopup: false,
      newTodoName: ''
    })
  }

  renderTodosList() {
    return (
      <>
        <Grid padded>
          {this.state.todos.map((todo, pos) => {
            return (
              <Grid.Row key={todo.todoId}>
                <Grid.Column width={1} verticalAlign="middle">
                  <Checkbox
                    onChange={() => this.onTodoCheck(pos)}
                    checked={todo.done}
                  />
                </Grid.Column>
                <Grid.Column width={10} verticalAlign="middle">
                  {todo.name}
                </Grid.Column>
                <Grid.Column width={3} floated="right">
                  {todo.dueDate}
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(todo.todoId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() =>
                      this.setState({
                        ...this.state,
                        deleteConfirmation: true,
                        activeTodo: todo
                      })
                    }
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column>
                {todo.attachmentUrl && (
                  <Image src={todo.attachmentUrl} size="small" wrapped />
                )}
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            )
          })}
        </Grid>
        <DeleteConfirmation
          onClose={() => this.onCloseDelete()}
          deleteTodo={() =>
            this.state.activeTodo !== null &&
            this.onTodoDelete(this.state.activeTodo.todoId)
          }
          show={this.state.deleteConfirmation && this.state.activeTodo !== null}
        />
        <AddTodoPopup
          onClose={() => this.onCloseAdd()}
          addTodo={() => this.onTodoCreate()}
          state={this.state}
          setState={(item: any) => this.setState({ ...this.state, ...item })}
          show={this.state.todoPopup}
        />
      </>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
