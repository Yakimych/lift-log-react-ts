// Vite (esbuild in dev, Rollup in prod) can surface a CommonJS module's whole
// namespace object as the default import (e.g. `{ default: Component, ... }`)
// instead of the component itself. React then throws "Element type is invalid
// ... but got: object". The old webpack toolchain unwrapped this automatically.
//
// This normalises such an import back to its real default export. It is a
// no-op for modules whose default is already the value we want.
export const interopDefault = <T>(mod: T): T => {
  const maybe = mod as { default?: T };
  return maybe && maybe.default ? maybe.default : mod;
};
