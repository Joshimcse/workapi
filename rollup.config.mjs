import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: {
    router: 'src/router.ts',
    workfly: 'src/workfly.ts',
    middlewares: 'src/middlewares.ts',
  },
  output: [
    {
      dir: './',
      format: 'esm',
      sourcemap: false,
      entryFileNames: '[name].js',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
      useTsconfigDeclarationDir: true,
    }),
    terser({
      compress: false,
      mangle: true,
      output: {
        comments: false,
        beautify: true,
      },
    }),
  ],
  treeshake: true,
};
