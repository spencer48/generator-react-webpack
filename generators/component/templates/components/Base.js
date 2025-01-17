'use strict';

import React from 'react/addons';

require('<%= style.webpackPath %>');

class <%= component.className %> extends React.Component {
  render() {
    return (
      <div className="<%= style.className %>">
        Please edit <%= component.path %>/<%= component.fileName %> to update this component!
      </div>
    );
  }
}

// Uncomment properties you need
// <%= component.className %>.propTypes = {};
// <%= component.className %>.defaultProps = {};

export default <%= component.className %>;
