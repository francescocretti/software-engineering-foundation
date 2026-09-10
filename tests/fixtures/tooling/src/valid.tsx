type StatusProps = {
  label: string
  onActivate: () => void
}

export function StatusButton({ label, onActivate }: StatusProps): React.JSX.Element {
  return (
    <button type="button" onClick={onActivate}>
      {label}
    </button>
  )
}
