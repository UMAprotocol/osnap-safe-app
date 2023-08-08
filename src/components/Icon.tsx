type Props = {
  name: string;
  className?: string;
};
export function Icon({ name, className }: Props) {
  return (
    <svg className={className}>
      <use href={`icons.svg#${name}`} />
    </svg>
  );
}
