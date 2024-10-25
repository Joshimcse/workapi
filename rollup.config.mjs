import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/workfly.ts',
  output: {
    file: 'workfly.js',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      useTsconfigDeclarationDir: true,
    }),
    terser({
      compress: false,
      mangle: false,
      output: {
        comments: false,
        beautify: true,
      },
    }),
  ],
  treeshake: true,
};
