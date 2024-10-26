import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: {
    workfly: 'src/workfly.ts',
    router: 'src/router.ts',
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
      compress: true,
      mangle: true,
      output: {
        comments: false,
        beautify: false,
      },
    }),
  ],
  treeshake: true,
};
