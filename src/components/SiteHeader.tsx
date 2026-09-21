import * as React from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "reactstrap";
import { signOut } from "../auth/authClient";
import { useViewer } from "../auth/viewer";
import "./App.css";

type Props = {
  title: string;
  /** Rendered on a board, linking back to the list of all logs. */
  showAllLogsLink?: boolean;
};

const SiteHeader: React.FunctionComponent<Props> = props => {
  const viewer = useViewer();

  const handleSignOut = () =>
    signOut().then(() => window.location.assign("/"));

  return (
    <header className="App-header d-flex align-items-center justify-content-between">
      <h1 className="App-title">{props.title}</h1>
      <div className="d-flex align-items-center App-header-actions">
        {props.showAllLogsLink && (
          <Link to="/" className="App-nav-link me-3">
            All logs
          </Link>
        )}
        {viewer && (
          <span className="App-viewer me-3">
            {viewer.name || viewer.email}
            {viewer.isAdmin && (
              <Badge color="info" className="ms-2">
                Admin
              </Badge>
            )}
          </span>
        )}
        <Button color="light" size="sm" outline={true} onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
};

export default SiteHeader;
