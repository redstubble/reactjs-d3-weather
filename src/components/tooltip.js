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
    border: ${(props) => (props.border ? '3px solid black' : 'none')};
  }
`;

const TextContainer = styled.span`
  font-weight: ${(props) => (props.highlight ? 'bold' : 'normal')};
  opacity: ${(props) => props.highlight}};
  font-size: 0.8em;
`;

export const highlight = (bool) => {
  return bool ? '1' : '0.8';
};

class tooltip extends React.Component {
  state = {};

  render() {
    const { d3populated, elements, handleChange } = this.props;
    if (!d3populated) return null;
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
                  <TextContainer highlight={highlighted}>
                    {el.name}
                  </TextContainer>
                </Grid.Column>
                <Grid.Column width={1}>
                  <ColorContainer
                    color={el.color}
                    border={el.live}
                    opacity={highlighted}
                  />
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
