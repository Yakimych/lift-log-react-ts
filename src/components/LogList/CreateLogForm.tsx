import * as React from "react";
import { Button, Spinner } from "reactstrap";

type Props = {
  name: string;
  title: string;
  canCreate: boolean;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onTitleChange: (title: string) => void;
  onCreate: () => void;
};

const CreateLogForm: React.FunctionComponent<Props> = props => (
  <form
    className="row align-items-end create-log-form"
    onSubmit={e => {
      e.preventDefault();
      if (props.canCreate && !props.isSaving) {
        props.onCreate();
      }
    }}
  >
    <div className="col">
      <label className="mb-0 small text-muted" htmlFor="new-log-name">
        Name (used in the URL)
      </label>
      <input
        id="new-log-name"
        className="form-control form-control-sm"
        type="text"
        placeholder="squats"
        maxLength={20}
        disabled={props.isSaving}
        value={props.name}
        onChange={e => props.onNameChange(e.target.value)}
      />
    </div>
    <div className="col">
      <label className="mb-0 small text-muted" htmlFor="new-log-title">
        Title
      </label>
      <input
        id="new-log-title"
        className="form-control form-control-sm"
        type="text"
        placeholder="Squats"
        maxLength={50}
        disabled={props.isSaving}
        value={props.title}
        onChange={e => props.onTitleChange(e.target.value)}
      />
    </div>
    <div className="col-auto">
      <Button
        type="submit"
        color="primary"
        size="sm"
        disabled={!props.canCreate || props.isSaving}
      >
        {props.isSaving && <Spinner size="sm" className="me-2" />}
        Create log
      </Button>
    </div>
  </form>
);

export default CreateLogForm;
