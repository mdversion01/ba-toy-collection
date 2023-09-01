import React from "react";
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';

const TypeaheadSelectField = props => {

  const toTitleCase = (label) => {
    return label.replace(/\s+/g, '').replace(/^(.)|\s+(.)/g, (match) => match.toUpperCase());
  };

  return (
    <Form.Group
      controlId={`form${toTitleCase(props.labelName)}`}
    >
      <Form.Label className="title">{props.labelName}</Form.Label>
      <div className="form-control-wrapper">
        <div className={props.errors ? 'typeahead-error' : ''}>
          <Typeahead
            allowNew
            id={props.id}
            options={props.options}
            selected={[...props.select, ...(props.new ? [{ label: props.new, customOption: true }] : [])]}
            onChange={props.handler}
            onInputChange={(input) => props.set(input)}
            placeholder={props.placeholder}
            size="sm"
          />
        </div>
        {props.errors && <span className="error">{props.errors}</span>}
      </div>
    </Form.Group>
  );
};

export default TypeaheadSelectField;
