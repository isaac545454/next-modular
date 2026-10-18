type DefinitionItem = {
  term: string
  description: string
}

type DefinitionListProps = {
  items: readonly DefinitionItem[]
}

export function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl className="m-0 grid gap-3">
      {items.map((item) => (
        <div key={item.term} className="grid gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-tlc-purple">
            {item.term}
          </dt>
          <dd className="m-0 text-sm text-tlc-navy">{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}
