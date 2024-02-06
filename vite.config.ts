import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [tsConfigPaths()],
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
}
