type FilterProps = {
  name: string
  isPressed: boolean
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

export default function FilterButton(props: FilterProps) {
  return (
    <button
      type='button'
      className='btn toggle-btn'
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span className='visually-hidden'>Show </span>
      <span>{props.name}</span>
      <span className='visually-hidden'> tasks</span>
    </button>
  )
}
