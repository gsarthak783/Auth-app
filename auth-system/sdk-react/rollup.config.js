import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  // Build the main bundle
  {
    input: 'src/index.tsx',
    external: ['react', 'react-dom', '@accesskit/auth'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx']
      })
    ]
  },
  // Build the type definitions
  {
    input: 'src/index.tsx',
    output: {
      file: pkg.types,
      format: 'es'
    },
    external: ['react', 'react-dom', '@accesskit/auth'],
    plugins: [dts()]
  }
]; 