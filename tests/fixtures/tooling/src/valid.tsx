type StatusProps = {
  label: string
  onActivate: () => void
}

export const StatusButton = ({ label, onActivate }: StatusProps): React.JSX.Element => (
  <button type="button" onClick={onActivate}>
    {label}
  </button>
)
