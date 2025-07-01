export function hasPermission(code) {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.permissions?.includes(code);
}