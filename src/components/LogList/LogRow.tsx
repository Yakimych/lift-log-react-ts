import { PencilIcon, TrashIcon } from "@primer/octicons-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { LiftLogSummary } from "../../types/liftTypes";

type Props = {
  log: LiftLogSummary;
  isEdited: boolean;
  editedTitle: string;
  isSaving: boolean;
  onStartEdit: (log: LiftLogSummary) => void;
  onEditedTitleChange: (title: string) => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onDelete: (log: LiftLogSummary) => void;
};

const LogRow: React.FunctionComponent<Props> = props => {
  const { log } = props;

  return (
    <div className="row align-items-center log-row">
      <div className="col">
        {props.isEdited ? (
          <input
            className="form-control form-control-sm"
            type="text"
            maxLength={50}
            autoFocus={true}
            disabled={props.isSaving}
            value={props.editedTitle}
            aria-label={`Title of ${log.name}`}
            onChange={e => props.onEditedTitleChange(e.target.value)}
          />
        ) : (
          <Link to={`/${log.name}`}>{log.title || log.name}</Link>
        )}
      </div>
      <div className="col text-muted">/{log.name}</div>
      <div className="col">
        {log.entryCount} {log.entryCount === 1 ? "entry" : "entries"}
      </div>
      <div className="col-auto log-row-actions">
        {props.isEdited ? (
          <>
            <Button
              color="primary"
              size="sm"
              className="me-1"
              disabled={props.isSaving || props.editedTitle.trim().length === 0}
              onClick={props.onSaveTitle}
            >
              Save
            </Button>
            <Button
              color="secondary"
              size="sm"
              disabled={props.isSaving}
              onClick={props.onCancelEdit}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              color="link"
              size="sm"
              className="p-1"
              title="Rename log"
              aria-label={`Rename ${log.name}`}
              disabled={props.isSaving}
              onClick={() => props.onStartEdit(log)}
            >
              <PencilIcon />
            </Button>
            <Button
              color="link"
              size="sm"
              className="p-1 text-danger"
              title="Delete log"
              aria-label={`Delete ${log.name}`}
              disabled={props.isSaving}
              onClick={() => props.onDelete(log)}
            >
              <TrashIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LogRow;
