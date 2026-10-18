import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import rule from './no-cross-module-imports.js'

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const checkoutIndex = path.join(
  repoRoot,
  'src/app/modules/checkout/index.ts',
)
const checkoutPage = path.join(
  repoRoot,
  'src/app/modules/checkout/pages/CheckoutPage/index.tsx',
)

RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
})

ruleTester.run('no-cross-module-imports', rule, {
  valid: [
    {
      filename: checkoutIndex,
      code: `import { bus } from '@/shared/frontend-events'\n`,
    },
    {
      filename: checkoutPage,
      code: `import { confirmCheckout } from '../../service/checkout-flow'\n`,
    },
    {
      filename: checkoutIndex,
      code: `import { checkoutRoutes } from './routes'\n`,
    },
  ],
  invalid: [
    {
      filename: checkoutIndex,
      code: `import { paymentRoutes } from '@/modules/payment'\n`,
      errors: [{ messageId: 'crossModule' }],
    },
    {
      filename: checkoutIndex,
      code: `import { succeedSimulatedPayment } from '@/modules/payment/service/simulated-payment'\n`,
      errors: [{ messageId: 'crossModule' }],
    },
    {
      filename: checkoutPage,
      code: `import { succeedSimulatedPayment } from '../../../payment/service/simulated-payment'\n`,
      errors: [{ messageId: 'crossModule' }],
    },
    {
      filename: checkoutIndex,
      code: `import everything from '@/modules'\n`,
      errors: [{ messageId: 'modulesRoot' }],
    },
    {
      filename: checkoutIndex,
      code: `export { paymentRoutes } from '@/modules/payment'\n`,
      errors: [{ messageId: 'crossModule' }],
    },
    {
      filename: checkoutIndex,
      code: `const load = () => import('@/modules/payment')\n`,
      errors: [{ messageId: 'crossModule' }],
    },
  ],
})
