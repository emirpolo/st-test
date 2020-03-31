import { Component, ComponentInterface, Element, Prop, h } from "@stencil/core";

@Component({
  tag: 'table-row'
})
export class TableRow implements ComponentInterface {
  raf;

  @Element() host;

  @Prop() canRender = false;

  @Prop() row?;
  @Prop() columns?;
  @Prop() observer;

  // constructor() {
  //   if (this.observe) {
  //     this.observer = new IntersectionObserver(this.observerCallback, this.observe);
  //   }
  // }

  componentDidLoad() {
    this.observer && this.observer.observe(this.host);
  }

  // observerCallback = (entries, _observer) => {
  //   cancelAnimationFrame(this.raf);
  //   this.raf = requestAnimationFrame(() => {
  //     this.canRender = entries[0].isIntersecting;
  //   });
  // }

  // observerCallback_BK = (entries, _observer) => {
  //   entries.forEach(this.setVisibility);
  // }

  // setVisibility(entry) {
  //   requestAnimationFrame(function () {
  //     // entry.target.style.opacity = entry.isIntersecting ? 1 : 0;
  //     entry.target.style.visibility = entry.isIntersecting ? 'visible' : 'hidden';
  //   });
  // }

  renderCells() {
    return this.row && this.columns.map(col => {
      const cellvalue = this.row[col.key];
      const value = col.render ? col.render(cellvalue, this.row) : cellvalue;

      return <td key={col.key}>{value}</td>
    });
  }

  render() {
    return this.canRender && this.renderCells();
  }
}
