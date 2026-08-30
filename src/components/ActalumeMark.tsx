interface ActalumeMarkProps {
  className?: string;
  label?: string;
}

export function ActalumeMark({ className, label = 'Actalume mark' }: ActalumeMarkProps) {
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}actalume-mark-illuminated.png`}
      alt={label}
    />
  );
}
