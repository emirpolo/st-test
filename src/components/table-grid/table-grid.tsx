import { Component, ComponentInterface, State, h, Element } from "@stencil/core";
import { getDummyData } from "./utils/services";


@Component({
  tag: 'table-grid',
  styleUrl: './table-grid.scss'
})
export class TableGrid implements ComponentInterface {
  columns;
  bounds;
  observer;
  raf;

  @Element() host: HTMLElement;

  @State() tableData;

  constructor() {
    getDummyData().then(data => this.tableData = data /*.concat(data, data, data, data, data, data, data, data, data)*/);
    this.columns = this.setColumns();
    this.observer = new IntersectionObserver(this.observerCallback, {
      root: this.host,
      rootMargin: '100px 20px',
      threshold: 1.0
    });
  }

  setColumns() {
    // return [
    //   { key: 'id', header: 'ID' }, { key: 'name', header: 'Name' },
    //   { key: 'email', header: 'E-mail' }, { key: 'body', header: 'Detail' }
    // ]
    return [
      { key: 'albumId', header: 'Album #' }, { key: 'id', header: 'ID' },
      { key: 'title', header: 'Name' },
      { key: 'url', header: 'Cover', render: (cell, row) => <img loading="lazy" style={{ height: "20px" }} src={cell} alt={row.title} /> },
      { key: 'thumbnailUrl', header: 'Preview', render: (cell, row) => <img loading="lazy" style={{ height: "20px" }} src={cell} alt={row.title} /> }
    ]
  }

  observerCallback(entries) {
    cancelAnimationFrame(this.raf);
    // this.raf= requestAnimationFrame(function () {
    entries.forEach(function (entry) {
      if (!entry.target.canRender) entry.target.canRender = entry.isIntersecting; // avoid first rendereing ROW
      entry.target.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
      //  requestAnimationFrame(_ => entry.target.style.visibility = entry.isIntersecting ? 'visible' : 'hidden');
    });
    //   });
  }

  renderHeaders() {
    return <table-row>
      {this.columns.map(col => <th key={col.key}>{col.header}</th>)}
    </table-row>
  }

  renderbody() {
    return this.tableData.map((row, i) => <table-row key={i} row={row} columns={this.columns} observer={this.observer} />);
  }


  render() {
    if (!this.tableData) return 'loading ...';

    return <table>
      <thead>{this.renderHeaders()}</thead>
      <tbody>{this.renderbody()}</tbody>
    </table>;
  }
}
