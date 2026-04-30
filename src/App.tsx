import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { useAuth } from "@clerk/react";

const App = () => {
  const { getToken } = useAuth();

  const handleProtectedCall = async () => {
    const token = await getToken();

    await fetch("http://localhost:4000/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <>
      <header>
        <Show when='signed-out'>
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when='signed-in'>
          <UserButton />
          <button onClick={handleProtectedCall}>Call API</button>
        </Show>
      </header>
    </>
  );
};

export default App;
