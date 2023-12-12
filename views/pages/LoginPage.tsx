import RootLayout from "./layout";

const LoginPage = () => {
  return (
    <RootLayout title="Sign In">
      <main className="mx-auto max-w-screen-xl px-2">
        <h1>Sign In</h1>
        <form hx-post="/auth/login" hx-disabled-elt="#login-submit">
          <section>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
            />
          </section>
          <section>
            <label htmlFor="current-password">Password</label>
            <input
              id="current-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </section>
          <button type="submit" id="login-submit">
            Sign in
          </button>
        </form>
      </main>
    </RootLayout>
  );
};

export default LoginPage;
