export default class VGridMath {
  _lastScrollTop = 0;
  _scrollEnded = false;

  scrollHeight;
  maxRowsByPage;

  constructor(public tableHeight, public totalRows, public rowHeight = 30) {
    this.scrollHeight = rowHeight * (totalRows + 1);
    this.maxRowsByPage = Math.floor((tableHeight - rowHeight) / rowHeight);
  }

  getFirstRowIndex(scrollTop) {
    const isScrollDown = scrollTop > this._lastScrollTop; // ? 'DOWN' : 'UP';
    this._lastScrollTop = scrollTop;

    if (this._scrollEnded && isScrollDown) return;

    return Math.floor(scrollTop / this.rowHeight);
  }

  getPageRange(tableData, pageStart) {
    this._scrollEnded = false;
    let pageEnd = pageStart + this.maxRowsByPage;

    if (pageEnd > this.totalRows) {
      pageEnd = this.totalRows;
      pageStart = pageEnd - this.maxRowsByPage;
      this._scrollEnded = true;
    }

    return tableData.slice(pageStart, pageEnd);
  }

}
