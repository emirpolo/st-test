import { Component, ComponentInterface, Prop, h } from "@stencil/core";

@Component({
  tag: 'v-row'
})
export class TableRow implements ComponentInterface {
  @Prop() row?;
  @Prop() columns?;


  renderCells() {
    return this.row && this.columns.map(col => {
      const cellvalue = this.row[col.key];
      const value = col.render ? col.render(cellvalue, this.row) : cellvalue;

      return <td key={col.key}>{value}</td>
    });
  }

  render() {
    return this.renderCells();
  }
}
