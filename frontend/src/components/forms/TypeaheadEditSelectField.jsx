import React from "react";
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';

const TypeaheadEditSelectField = props => {

  const toTitleCase = (label) => {
    return label.replace(/\s+/g, '').replace(/^(.)|\s+(.)/g, (match) => match.toUpperCase());
  };

  return (
    <Form.Group
      controlId={`form${toTitleCase(props.labelName)}`}
    >
      <Form.Label className="title">{props.labelName}</Form.Label>
      <div className={props.fcw}>
        <div className={props.errors ? 'typeahead-error' : ''}>
          <Typeahead
            allowNew
            id={props.id}
            newSelectionPrefix={props.nsp}
            disabled={props.disable}
            options={props.options}
            value={props.value}
            placeholder="Type anything..."
            size="sm"
            selected={props.selectItem}
            onChange={props.handler}
          />
        </div>
        {props.errors && <span className="error">{props.errors}</span>}
      </div>
    </Form.Group>
  );
};

export default TypeaheadEditSelectField;
