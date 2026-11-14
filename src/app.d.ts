// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Declares Vite's `?raw` imports, used to pull the legal documents in from
// docs/legal/ at build time (src/lib/server/legal.ts).
/// <reference types="vite/client" />

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
