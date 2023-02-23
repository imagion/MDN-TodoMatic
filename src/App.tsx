import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'

import Todo from './components/Todo'
import Form from './components/Form'
import FilterButton from './components/FilterButton'
import usePrevious from './hooks/usePrevious'

import TodoItem from './interfaces/TodoItem'

type AppProps = {
  tasks: TodoItem[]
}

interface FilterInterface {
  [key: string]: (value: TodoItem) => boolean
}

const FILTER_MAP: FilterInterface = {
  All: () => true,
  Active: (task: TodoItem) => !task.completed,
  Completed: (task: TodoItem) => task.completed,
}
const FILTER_NAMES = Object.keys(FILTER_MAP)

export default function App(props: AppProps) {
  const [tasks, setTasks] = useState(props.tasks)
  const [filter, setFilter] = useState('All')

  const listHeadingRef = useRef<HTMLHeadingElement>(null)

  const addTask = (name: string) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false }
    setTasks([...tasks, newTask])
  }

  const toggleTaskCompleted = (id: string) => {
    const updatedTasks = tasks.map((task: TodoItem) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    const remainingTasks = tasks.filter(task => id !== task.id)
    setTasks(remainingTasks)
  }

  const editTask = (id: string, newName: string) => {
    const editedTaskList = tasks.map(task => {
      if (id === task.id) {
        return { ...task, name: newName }
      }
      return task
    })
    setTasks(editedTaskList)
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ))

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const headingText = `${taskList.length} ${tasksNoun} remaining`

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))

  const prevTaskLength: number = usePrevious(tasks.length) as number

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current?.focus()
    }
  }, [tasks.length, prevTaskLength])

  return (
    <div className='todoapp stack-large'>
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className='filters btn-group stack-exception'>{filterList}</div>
      <h2 id='list-heading' tabIndex={-1} ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role='list'
        className='todo-list stack-large stack-exception'
        aria-labelledby='list-heading'
      >
        {taskList}
      </ul>
    </div>
  )
}
