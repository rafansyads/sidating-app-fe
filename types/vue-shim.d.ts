// Separate .vue module declarations (non-invasive) so components like VButton resolve in TS & ESLint
// Placed here to avoid changing existing env.d.ts or component files.
import type { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >
  export default component
}
