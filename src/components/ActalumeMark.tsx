interface ActalumeMarkProps {
  className?: string;
  label?: string;
}

export function ActalumeMark({ className, label = 'Actalume mark' }: ActalumeMarkProps) {
  return <img className={className} src="/actalume-mark-illuminated.png" alt={label} />;
}
