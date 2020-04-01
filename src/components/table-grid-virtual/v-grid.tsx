import { Component, ComponentInterface, State, h, Element, Host, Listen } from "@stencil/core";
import { getDummyData } from "./utils/services";
import { Debounce } from "@qrvey/widgetutils";


@Component({
  tag: 'v-grid',
  styleUrl: './v-grid.scss'
})
export class TableGrid implements ComponentInterface {
  columns;
  tableHeight = 700;
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
    this.setColumnDimensions();
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

  setColumnDimensions() {
    const minColWidth = 50; // this must to be a Prop

    this.table = this.host.querySelector('table');

    if (this.table && !this.columns.initialized) {
      requestAnimationFrame(_ => {
        const thList = this.table.querySelectorAll('thead th');
        const colList = this.table.querySelectorAll('col');

        for (let i = 0, l = thList.length; i < l; i++) {
          colList[i].setAttribute('width', Math.max(minColWidth, thList[i].clientWidth) + 'px');
        }
        this.table.style.tableLayout = 'fixed';
        this.columns.initialized = true;
      });
    }
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


  renderCols() {
    return <colgroup key="columns">
      {this.columns.map(col => <col key={col.key} />)}
    </colgroup>;
  }

  renderHeaders() {
    return <thead key="header">
      <v-row key="header">
        {this.columns.map(col => <th key={col.key}>{col.header}</th>)}
      </v-row>
    </thead>;
  }

  renderbody() {
    return <tbody key="body">
      {this.getVisibleData().map((row, i) => <v-row key={i} row={row} columns={this.columns} />)}
    </tbody>;
  }

  render() {
    if (!this.tableData) return 'loading ...';

    return <Host>
      <table key="table">
        {this.renderCols()}
        {this.renderHeaders()}
        {this.renderbody()}
      </table>

      <div key='scroll' class="v-scroll" style={{ height: (this.calcs.scrollHeight) + 'px' }} />
    </Host>;
  }
}
