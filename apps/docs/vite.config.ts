import { resolve } from 'path';
import { defineConfig } from 'vite-plus';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { ubeanPlugin } from 'ubean/vite';
import UnoCSS from 'unocss/vite';
import { docsLlmsPlugin } from './build/llms';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      '~': resolve(__dirname, './src'),
      '@': resolve(__dirname, '../../packages/ui/src')
    }
  },
  plugins: [ubeanPlugin(), UnoCSS(), VueJsx(), docsLlmsPlugin()],
  optimizeDeps: {
    exclude: ['@vean/ui', '@vean/aria']
  }
});
