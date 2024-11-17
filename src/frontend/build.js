import { build } from 'bun';
import { cp } from 'fs/promises';

await build({
  entrypoints: ['src/frontend/index.tsx'],
  outdir: 'src/frontend/build',
  splitting: false,
  format: 'esm',
  // minify: true,
  jsx: 'automatic',
});

// Copy the HTML template to the output directory
await cp('src/frontend/public/', 'src/frontend/build/', { recursive: true });
