import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  createKey = (item, column) => {
    return item._id + (column.label || column.key);
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {_.get(item, column.path) || column.content(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
