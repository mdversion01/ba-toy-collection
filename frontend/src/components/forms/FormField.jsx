import React from 'react';
import Form from 'react-bootstrap/Form';

const FormField = ({ label, fmLabel, type, value, checked, options, onChange, disabled, placeholder, addClass, fcw, errors }) => {

  const toTitleCase = (label) => {
    if (label) {
      return label.replace(/\s+/g, '').replace(/^(.)|\s+(.)/g, (match) => match.toUpperCase());
    }
    return '';
  };

  const renderFormField = () => {
    switch (type) {
      case 'text':
        return (
          <Form.Control
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            size="sm"
            placeholder={placeholder}
            style={{ borderColor: errors ? 'red' : '' }}
          />
        );
      case 'select':
        return (
          <Form.Control
            as="select"
            value={value}
            onChange={onChange}
            disabled={disabled}
            size="sm"
            placeholder={placeholder}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        );
      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            value={value}
            onChange={onChange}
            disabled={disabled}
            size="sm"
            rows={3}
          />
        );
      case 'checkbox':
        return (
          <Form.Check
            type="checkbox"
            checked={checked}
            onChange={onChange}
            label={label}
          />
        );
      // Add more cases for other types if needed

      default:
        return null;
    }
  };

  return (
    <Form.Group controlId={`form-${toTitleCase(label)}`}>
     {!['checkbox'].includes(type) && <Form.Label className={addClass}>{fmLabel}</Form.Label>}
      <div className={fcw}>
        {renderFormField()}
        {errors && <span className="error">{errors}</span>}
      </div>
    </Form.Group>
  );
};

export default FormField;
