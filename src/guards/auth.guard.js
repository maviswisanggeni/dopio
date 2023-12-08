import store from 'src/store';

export default {
  beforeRouteEnter(to, from, next) {
    const permissions = store().getters['auth/permissions'];
    if (!permissions.includes('AUTH')) return next(false);
    return next();
  },
};
