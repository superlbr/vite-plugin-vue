import luban from '@luban-ui/eslint-config';

export default luban({
  ignores: [
    'test/*'
  ]
}, {
  rules: {
    'no-console': 'off'
  }
});
