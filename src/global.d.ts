import type { SvelteComponent } from 'svelte'

declare global {
  interface Window {
    $apps: Map<string, SvelteComponent>
    $tooltip: SvelteComponent
  }
}

export {}
