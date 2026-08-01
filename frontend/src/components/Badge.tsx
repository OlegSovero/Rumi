type Props = { children: string };

export function Badge({ children }: Props) {
  return <span className="badge">{children}</span>;
}
