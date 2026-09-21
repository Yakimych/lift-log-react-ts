import * as React from "react";
import { Alert, Button, Spinner } from "reactstrap";
import { signInWithGoogle } from "../auth/authClient";
import "./App.css";

type Props = {
  message?: string;
};

const SignIn: React.FunctionComponent<Props> = props => {
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
    } catch {
      setErrorMessage("Could not start the Google sign-in. Please try again.");
      setIsSigningIn(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header d-flex align-items-center">
        <h1 className="App-title">Lift Log</h1>
      </header>
      <div className="mt-3 mb-3 p-4 box-shadow lift-log-container">
        <p>{props.message || "Sign in to view and edit the lift logs."}</p>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button color="primary" disabled={isSigningIn} onClick={handleSignIn}>
          {isSigningIn && <Spinner size="sm" className="me-2" />}
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
