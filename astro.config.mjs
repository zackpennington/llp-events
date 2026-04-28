// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// output: 'static' — site is fully static; existing /api/*.js Vercel functions are detected by Vercel independently of Astro's build.
export default defineConfig({
  site: 'https://www.llp-events.com',
  output: 'static',
  adapter: vercel(),
});
