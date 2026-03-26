export function getUser(session) {
  return {
    email: session.user?.email,
    jwt: session.jwt,
  };
}