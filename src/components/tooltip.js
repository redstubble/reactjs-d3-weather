import React from 'react';

export default ({ elements } = this.props) => (
  <div class="dashboard-tooltip tooltip-distribution-history">
    <p class="header">Legend</p>
    <div class="wrapper equipment-count">
      <ul>
        <li>
          <strong>
            <span class="type" />
          </strong>
          &nbsp
          <span class="count" />
        </li>
        <li>
          <strong>
            <span>Date:</span>
          </strong>
          &nbsp
          <span class="date" />
        </li>
        <li>
          <strong>
            <span>Time:</span>
          </strong>
          &nbsp
          <span class="time" />
        </li>
      </ul>
    </div>
  </div>
);
