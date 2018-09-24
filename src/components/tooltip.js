import React from 'react';
import { keys } from 'ramda';
import {
  Grid,
  Segment,
  Icon,
  Label,
  List,
  GridColumn,
  Checkbox,
} from 'semantic-ui-react';
import styled from 'styled-components';

const NoDecorationLink = {
  textDecoration: 'none',
  color: 'inherit',
};

const ColorContainer = styled.div`
  &&& {
    width: 100%;
    min-width: 1em;
    height: 1em;
    background-color: ${(props) => props.color};
    opacity: ${(props) => props.opacity};
  }
`;

export const highlight = (bool) => {
  return bool ? '1' : '0.5';
};

class tooltip extends React.Component {
  state = {};

  render() {
    const { elements, handleChange } = this.props;
    return (
      <div
        className="d3-weather-tooltip-legend  legend"
        style={{ border: '1px solid black', padding: '10px' }}
      >
        <p className="header">Legend</p>
        <Grid divided="vertically">
          {keys(elements).map((a) => {
            const el = elements[a];
            const highlighted = highlight(el.live);
            return (
              <React.Fragment key={el.name}>
                <Grid.Column
                  width={3}
                  mobile={5}
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    height: '1em',
                  }}
                >
                  <span style={{ opacity: { highlighted }, fontSize: '0.8em' }}>
                    {el.name}
                  </span>
                </Grid.Column>
                <Grid.Column width={1}>
                  <ColorContainer color={el.color} opacity={highlighted} />
                </Grid.Column>
                <Grid.Column width={1}>
                  <Checkbox
                    checked={!el.hide}
                    value={el.name}
                    onClick={handleChange}
                  />
                </Grid.Column>
              </React.Fragment>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default tooltip;
