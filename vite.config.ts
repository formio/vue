import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';

export default () => {
  return defineConfig({
    plugins: [dts({ rollupTypes: true }), tsConfigPaths()],
    build: {
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'formio-vue',
        fileName: 'index',
      },
      rollupOptions: {
        output: {
          globals: {
            vue: 'Vue',
          },
        },
        external: ['vue'],
      },
    },
  })
};
