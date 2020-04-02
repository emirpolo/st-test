import { h } from "@stencil/core";

function renderCols(columns = []) {
  return <colgroup key="columns">
    {columns.map(col => <col key={col.key} />)}
  </colgroup>;
}

function renderHeaders(columns = []) {
  return <thead key="header">
    <v-row key="header">
      {columns.map(col => <th key={col.key}>
        {col.header}
        <i class="v-col-resize" />
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
    {renderCols(columns)}
    {renderHeaders(columns)}
    {renderbody(columns, rowData)}
  </table>
}
