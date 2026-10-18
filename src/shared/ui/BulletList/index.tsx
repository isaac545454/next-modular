type BulletListProps = {
  items: readonly string[]
}

export function BulletList({ items }: BulletListProps) {
  return (
    <ul className="m-0 grid list-disc gap-1 pl-5 text-sm">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
