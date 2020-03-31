import { Component, ComponentInterface, h } from "@stencil/core";

@Component({
  tag: 'qv-pill-test'
})
export class PillTest implements ComponentInterface {
  _pillList = [
    {id: 4, text: 'Lorem impsun'},
    {id: 5, text: 'Dolle set animus'},
    {id: 1, text: 'hola'},
    {id: 2, text: 'mundo'},
    {id: 3, text: 'cruel'},
    {id: 4, text: 'Lorem impsun'},
    {id: 5, text: 'Dolle set animus'},
    {id: 6, text: 'Etium end.'},
  ];

  render() {
    return [
      <h5>Rezise the window to see the changes ¡</h5>,
    <qv-pill-container list={this._pillList} />
    ]
  }

}
