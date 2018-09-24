import React from 'react';
import { Card } from 'semantic-ui-react';
import { formatDate } from '../utils/d3-helpers';

class HeaderToolTip extends React.Component {
  render({ element } = this.props) {
    if (element) {
      return (
        <Card centered>
          <Card.Content style={{ minHeight: '100px' }} textAlign={'center'}>
            <Card.Header>{element.name}</Card.Header>
            <Card.Meta>{formatDate(element.time)}</Card.Meta>
            <Card.Description>Temp: {element.temp} °C</Card.Description>
          </Card.Content>
        </Card>
      );
    }
    return (
      <Card centered>
        <Card.Content style={{ minHeight: '100px' }} textAlign={'center'}>
          <Card.Header>5 Day Weather Forecast</Card.Header>
          <Card.Meta />
          <Card.Description />
        </Card.Content>
      </Card>
    );
  }
}

export default HeaderToolTip;
