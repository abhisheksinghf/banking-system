router.beforeStateChange.add((event) => {
  const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const target = event.toState && event.toState.path;

  if (!loggedIn && target !== 'login') {
    event.preventDefault();
    router.go('login');
  }
});
