import React from 'react';
import { keys } from 'ramda';
import { Grid, Segment, Icon, Label, List } from 'semantic-ui-react';

const NoDecorationLink = {
  textDecoration: 'none',
  color: 'inherit',
};

export const highlight = (bool) => {
  const opacity = bool ? '1' : '0.5';
  return {
    opacity: opacity,
  };
};

export default ({ elements } = this.props) => (
  <div className="dashboard-tooltip tooltip-distribution-history">
    <p className="header">Legend</p>
    <Grid>
      {keys(elements).map((a) => {
        const el = elements[a];
        return (
          <React.Fragment key={el.name}>
            <Grid.Column style={highlight(el.live)} width={6}>
              {el.name}
            </Grid.Column>
            <Grid.Column
              style={
                ([
                  {
                    height: '18px',
                    backgroundColor: el.color,
                  },
                ],
                highlight(el.live))
              }
              width={6}
            />
            {/* <div style={{ width: '100%' }}>
                <div style={{ float: 'left', width: '40%' }}>{el.name}</div>
                <div
                  style={{
                    float: 'left',
                    width: '40%',
                    // maxWidth: '50px',
                    backgroundColor: el.color,
                    border: '1px solid black',
                  }}
                />
              </div> */}
          </React.Fragment>
        );
      })}
    </Grid>
  </div>
);
