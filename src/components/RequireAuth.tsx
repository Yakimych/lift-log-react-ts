import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { useSession } from "../auth/authClient";
import { Viewer, ViewerContext } from "../auth/viewer";
import "./App.css";
import SignIn from "./SignIn";

type Props = {
  children?: React.ReactNode;
};

const meUrl = `${import.meta.env.REACT_APP_API_BASE_URL || "/api"}/me`;

const Loading: React.FunctionComponent<{ message: string }> = props => (
  <div className="App">
    <div className="p-4 text-muted">
      <Spinner size="sm" className="me-2" />
      {props.message}
    </div>
  </div>
);

/**
 * Nothing in the app is public, so every route renders behind this gate. The
 * API enforces the same rules again on each request; this only decides what
 * the browser bothers to show.
 */
const RequireAuth: React.FunctionComponent<Props> = props => {
  const { data: session, isPending } = useSession();
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [viewerFailed, setViewerFailed] = useState(false);

  const userId = session ? session.user.id : null;

  useEffect(() => {
    if (userId === null) {
      setViewer(null);
      setViewerFailed(false);
      return;
    }

    let cancelled = false;
    axios
      .get<Viewer>(meUrl, { withCredentials: true })
      .then(result => {
        if (!cancelled) {
          setViewer(result.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setViewerFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (isPending) {
    return <Loading message="Checking your sign-in..." />;
  }

  if (!session) {
    return <SignIn />;
  }

  if (viewerFailed) {
    return (
      <SignIn message="Your session could not be verified. Please sign in again." />
    );
  }

  if (!viewer) {
    return <Loading message="Loading your account..." />;
  }

  return (
    <ViewerContext.Provider value={viewer}>
      {props.children}
    </ViewerContext.Provider>
  );
};

export default RequireAuth;
