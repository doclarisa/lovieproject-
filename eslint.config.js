import nextPlugin from 'eslint-config-next/core';

export default [
  {
    ignores: ['.next', 'node_modules'],
  },
  {
    files: ['**/*.{js,jsx}'],
    ...nextPlugin,
  },
];
