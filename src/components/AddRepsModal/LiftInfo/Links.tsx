import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import {
  Button,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { MAX_NUMBER_OF_LINKS } from "../../../redux/dialogReducer";
import { LiftInfoLink } from "../../../types/LiftTypes";

type Props = {
  onLinkAdd: () => void;
  onLinkRemove: (index: number) => void;
  onLinkTextChange: (index: number, newTextValue: string) => void;
  onLinkUrlChange: (index: number, newUrlValue: string) => void;
  links: ReadonlyArray<LiftInfoLink>;
  canAddMoreLinks: boolean;
};

const LINK_ELEMENT_HEIGHT = 40;

const Links: React.FunctionComponent<Props> = props => {
  const {
    links,
    onLinkTextChange,
    onLinkUrlChange,
    onLinkAdd,
    onLinkRemove
  } = props;
  const linksContainerHeight = links.length * LINK_ELEMENT_HEIGHT;

  return (
    <div className="mt-2">
      <AnimateHeight
        duration={350}
        className="pt-1 mx--1"
        height={linksContainerHeight}
      >
        {links.map((link, index) => (
          <div
            className="d-flex align-items-start px-1"
            style={{ height: LINK_ELEMENT_HEIGHT }}
            key={`${link.text}_${link.url}`}
          >
            <Input
              bsSize="sm"
              name="text"
              className="mr-3 w-50"
              defaultValue={link.text}
              maxLength={20}
              placeholder="Display text"
              type="text"
              onBlur={e => onLinkTextChange(index, e.target.value)}
            />
            <InputGroup>
              <Input
                name="url"
                bsSize="sm"
                defaultValue={link.url}
                maxLength={200}
                placeholder="Url"
                type="text"
                onBlur={e => onLinkUrlChange(index, e.target.value)}
              />
              <InputGroupAddon addonType="append">
                <div
                  className="input-group-text remove-icon-wrapper"
                  onClick={() => onLinkRemove(index)}
                >
                  <Octicon icon={getIconByName("x")} />
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        ))}
      </AnimateHeight>
      <Button
        onClick={onLinkAdd}
        size="sm"
        disabled={!props.canAddMoreLinks}
        className={links.length > 0 ? "mt-2" : ""}
      >
        Add link
      </Button>
      <AnimateHeight duration={350} height={props.canAddMoreLinks ? 0 : "auto"}>
        <FormText color="muted">
          You can only add maximum {MAX_NUMBER_OF_LINKS} links.
        </FormText>
      </AnimateHeight>
    </div>
  );
};

export default Links;
