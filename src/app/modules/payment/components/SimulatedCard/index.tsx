'use client'

import {
  SIMULATED_AMOUNT,
  SIMULATED_CARD,
  SIMULATED_EXPIRY,
  SIMULATED_HOLDER,
} from '../../constants'

export function SimulatedCard() {
  return (
    <div className="grid gap-4 rounded-tlc bg-[linear-gradient(to_bottom_right,var(--color-tlc-navy),var(--color-tlc-blue))] p-5 text-white shadow-tlc">
      <p className="m-0 inline-flex w-fit rounded-tlc bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
        Cartão simulado
      </p>
      <p className="m-0 font-mono text-lg tracking-[0.28em]">{SIMULATED_CARD}</p>
      <div className="flex flex-wrap items-end justify-between gap-2 text-sm">
        <span>{SIMULATED_HOLDER}</span>
        <span>{SIMULATED_EXPIRY}</span>
        <span className="text-lg font-semibold">{SIMULATED_AMOUNT}</span>
      </div>
    </div>
  )
}
