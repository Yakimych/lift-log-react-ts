import { PencilIcon, TrashIcon } from "@primer/octicons-react";
import * as React from "react";
import { Button } from "reactstrap";
import { StoredLiftLogEntry } from "../types/liftTypes";
import { formatSets } from "../utils/liftUtils";

type Props = {
  entry: StoredLiftLogEntry;
  disabled: boolean;
  onEdit: (entry: StoredLiftLogEntry) => void;
  onDelete: (entry: StoredLiftLogEntry) => void;
};

const formatDate = (date: Date) => date.toISOString().substring(0, 10);

const LiftRow: React.FunctionComponent<Props> = props => {
  const { entry } = props;

  return (
    <div className="row align-items-center lift-row">
      <span className="col">{formatDate(entry.date)}</span>
      <span className="col">{entry.name}</span>
      <span className="col">{entry.weightLifted}</span>
      <span className="col d-flex align-items-center justify-content-between">
        <span>{formatSets(entry.sets)}</span>
        <span className="lift-row-actions">
          <Button
            color="link"
            size="sm"
            className="p-1"
            title="Edit entry"
            aria-label={`Edit entry for ${entry.name}`}
            disabled={props.disabled}
            onClick={() => props.onEdit(entry)}
          >
            <PencilIcon />
          </Button>
          <Button
            color="link"
            size="sm"
            className="p-1 text-danger"
            title="Delete entry"
            aria-label={`Delete entry for ${entry.name}`}
            disabled={props.disabled}
            onClick={() => props.onDelete(entry)}
          >
            <TrashIcon />
          </Button>
        </span>
      </span>
    </div>
  );
};

export default LiftRow;
