import { Component, ComponentInterface, State, h, Element, Host, Listen } from "@stencil/core";
import { getDummyData } from "./utils/services";
import { Debounce } from "@qrvey/widgetutils";


@Component({
  tag: 'v-grid',
  styleUrl: './v-grid.scss'
})
export class TableGrid implements ComponentInterface {
  columns;
  bounds;
  observer;
  raf;

  tableHeight = 500;
  rowHeight = 35;
  totalRows = 0;
  inEnd = false;
  lastScrollTop = 0;

  calcs;
  table;

  @State() index = 0;

  @Element() host: HTMLElement;

  @State() tableData;

  constructor() {
    this.columns = this.setColumns();
    getDummyData().then(data => {
      // data = data.slice(0, 50); // easy test

      this.totalRows = data.length;
      this.tableData = data /*.concat(data, data, data, data, data, data, data, data, data)*/

      this.calcs = {
        scrollHeight: this.rowHeight * (this.totalRows + 1), // +1 for header
        viewportRows: Math.floor((this.tableHeight - this.rowHeight) / this.rowHeight)
      }
      console.log(this.calcs)
    });
  }

  componentDidUpdate() {
    this.table = this.host.querySelector('table');
    requestAnimationFrame(_ => {
    if (this.table && !this.columns.initialized) {
      const thList = this.table.querySelectorAll('thead th');
      for (const th of thList) {
        console.log('-->>', th.clientWidth)
        th.setAttribute('width', th.clientWidth + 'px');
      }
      this.columns.initialized = true;
    }
  })
  }



  @Listen('scroll')
  @Debounce(16)
  onScroll(_e: MouseEvent) {
    const scrollTop = this.host.scrollTop;
    const dir = scrollTop > this.lastScrollTop ? 'DOWN' : 'UP';

    this.lastScrollTop = scrollTop;
    if (this.inEnd && dir === 'DOWN') return;

    this.index = Math.floor(scrollTop / this.rowHeight);
  }

  getVisibleData() {
    this.inEnd = false;
    let pageStart = this.index;
    let pageEnd = this.index + this.calcs.viewportRows;

    if (pageEnd > this.totalRows) {
      pageEnd = this.totalRows;
      pageStart = pageEnd - this.calcs.viewportRows;
      this.inEnd = true;
    }

    return this.tableData.slice(pageStart, pageEnd);
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


  renderHeaders() {
    return <v-row>
      {this.columns.map(col => <th key={col.key}>{col.header}</th>)}
    </v-row>
  }

  renderbody() {
    return this.getVisibleData().map((row, i) => <v-row key={i} row={row} columns={this.columns} />);
  }


  render() {
    if (!this.tableData) return 'loading ...';

    return <Host>
      <table key="table">
        <thead key="header">{this.renderHeaders()}</thead>
        <tbody key="body">{this.renderbody()}</tbody>
      </table>

      <div key='scroll' class="v-scroll" style={{ height: (this.calcs.scrollHeight) + 'px' }} />
    </Host>;
  }
}
