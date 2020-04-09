import { h } from "@stencil/core";
import ColumnResizer from './ResizeColumns';

function renderHeaders(columns = []) {
  const columResizer = new ColumnResizer();

  return <thead key="header">
    <v-row key="header">
      {columns.map((col, i) => <th key={col.key}>
        {col.header}
        <i class="v-col-resize" data-index={i} onMouseDown={columResizer.start} />
      </th>)}
    </v-row>
  </thead>;
}

function renderbody(columns = [], rowData = []) {
  return <tbody key="body">
    {rowData.map((row, i) => <v-row key={i} row={row} columns={columns} />)}
  </tbody>;
}

export function renderTable(columns, rowData) {
  return <table key="table">
    {renderHeaders(columns)}
    {renderbody(columns, rowData)}
  </table>
}
