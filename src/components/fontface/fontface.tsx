import { Component, Host, h, Listen } from '@stencil/core';
import {Debounce, capitalize} from '@qrvey/widgetutils';


@Component({
  tag: 'qv-fontface',
  styleUrl: 'fontface.css',
  shadow: true
})
export class Fontface {

  @Listen('resize', {target: 'window'})
  @Debounce()
  onResize() {
    console.log('Debounceada')
  }

  @Listen('resize', {target: 'window'})
  onResize2() {
    console.log('Sin Debounce')
  }

  render() {
    return (
      <Host>
        Shadow = true {capitalize('holi')}
        [<i class="q-icon-star" />]
      </Host>
    );
  }

}
