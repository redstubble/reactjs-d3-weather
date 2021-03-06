import React, { Component } from 'react';
import { Form, Checkbox } from 'semantic-ui-react';

export default class D3CheckboxRadioGroup extends Component {
  state = {};

  render({ handleChange, parentState } = this.props) {
    return (
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Checkbox
              radio
              label="Clear"
              name="checkboxRadioGroup"
              value="clear"
              checked={parentState === 'clear'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              radio
              label="Populate Graph"
              name="checkboxRadioGroup"
              value="weather"
              checked={parentState === 'weather'}
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>
        {/* <Form.Field>
          Selected value: <b>{parentState}</b>
        </Form.Field> */}
      </Form>
    );
  }
}
