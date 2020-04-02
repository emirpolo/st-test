import { Component, ComponentInterface, State, h, Element, Host, Listen } from "@stencil/core";
import { getDummyData } from "./utils/services";
import { Debounce } from "@qrvey/widgetutils";
import { renderTable } from "./utils/renders";
import VGridMath from "./utils/VGridMath";


@Component({
  tag: 'v-grid',
  styleUrl: './v-grid.scss'
})
export class TableGrid implements ComponentInterface {
  columns;
  tableHeight = 700;
  rowHeight = 35;
  calcs: VGridMath;
  table;

  @Element() host: HTMLElement;

  @State() tableData;
  @State() index = 0;

  constructor() {
    this.columns = this.setColumns();
    getDummyData().then(data => {
      // data = data.slice(0, 50); // easy test;
      this.tableData = data /*.concat(data, data, data, data, data, data, data, data, data)*/

      this.calcs = new VGridMath(this.tableHeight, data.length, this.rowHeight);
    });
  }

  componentDidUpdate() {
    this.setColumnDimensions();
  }


  @Listen('scroll')
  @Debounce(16)
  onScroll(_e: MouseEvent) {
    const index = this.calcs.getFirstRowIndex(this.host.scrollTop);
    if (index !== undefined) this.index = index;
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
    return this.calcs.getPageRange(this.tableData, this.index);
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


  render() {
    if (!this.tableData) return 'loading ...';

    return <Host>
      {renderTable(this.columns, this.getVisibleData())}

      <div key='scroll' class="v-scroll" style={{ height: (this.calcs.scrollHeight) + 'px' }} />
    </Host>;
  }
}
