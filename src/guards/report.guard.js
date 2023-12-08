export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const permissions = vm.$store.getters['auth/permissions'];
      if (!permissions.includes('REPORT')) return next(false);
      return next();
    });
    // const permissions = store().getters['auth/permissions'];
    // if (!permissions.includes('REPORT')) return next(false);
    // return next();
  },
};
