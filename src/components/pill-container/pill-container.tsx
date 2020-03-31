import { Component, ComponentInterface, Prop, State, Listen, Element, h, Host } from "@stencil/core";
import { Debounce } from "@qrvey/widgetutils";

@Component({
  tag: 'qv-pill-container',
  styleUrl: 'pill-container.css'
})
export class PillContainer implements ComponentInterface {
  _pillList = [];

  @Element() host: HTMLElement;

  @Prop() list = [];

  @State() hasOverflow = false;

  componentWillLoad() {
    this.init()
  }

  componentDidRender() {
    requestAnimationFrame(_ => this.interceptor(this.host));
  }

  @Listen('resize', { target: 'window' })
  @Debounce()
  onWindowResize() {
    this.init()
  }

  init() {
    if (!this.hasOverflow) this.hasOverflow = true;
    this._pillList = this.list.slice();
    this.hasOverflow = false;
  }

  interceptor(root) {
    const { clientWidth: cw, scrollWidth: sw, children } = root;
    const hasOverflow = sw > cw;

    if (hasOverflow) {
      const threshold = 5;
      const { bottom, height, right } = root.getBoundingClientRect();
      // https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
      const interceptedElm = document.elementFromPoint(
        right - threshold,
        bottom - height / 2 - threshold
      );
      const interceptedPosition = Array.from(children).indexOf(interceptedElm);

      this._pillList = this.list.slice(0, interceptedPosition);
      this.hasOverflow = true;
    }
  }


  /**** Render ****/

  renderPill(pill, _i) {
    return <span class='pill' key={pill.id} >
      {pill.text}
    </span>
  }

  renderPillPlus() {
    return this.hasOverflow && <span class="pill pill--seemore" key='seemore'>
      +{this.list.length - this._pillList.length}
    </span>
  }


  render() {
    return <Host data-overflow={this.hasOverflow}>{
      this._pillList
        .map(this.renderPill)
        .concat(this.renderPillPlus())
    }</Host>;
  }

}
