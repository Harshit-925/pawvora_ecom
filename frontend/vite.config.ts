import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/pawvora_ecom/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/components/InputForm.tsx',
        'src/components/ResultsPanel.tsx',
        'src/store/useAppStore.ts',
        'src/utils/validation.ts',
        'src/api/client.ts'
      ],
      thresholds: { lines: 80, functions: 80, branches: 70 },
    },
  },
}));
