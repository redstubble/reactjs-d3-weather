import React, { Component } from 'react'
import { Form, Checkbox } from 'semantic-ui-react'

export default class D3CheckboxRadioGroup extends Component {
  state = {}

  render({handleChange, parentState} = this.props) {
    return (
      <Form>
        <Form.Field>
          Selected value: <b>{parentState}</b>
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label='Clear'
            name='checkboxRadioGroup'
            value='clear'
            checked={parentState === 'clear'}
            onChange={handleChange} />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label='Weather Data'
            name='checkboxRadioGroup'
            value='weather'
            checked={parentState === 'weather'}
            onChange={handleChange}
          />
        </Form.Field>
      </Form>
    )
  }
}