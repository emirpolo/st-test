export default () => {
  setFontFace('qrvey-icons', 'https://s3.amazonaws.com/cdn.qrvey.com/widgets-assets/qrvey-icons/fonts/qrvey-icons.woff2');
};

function setFontFace(fontName, fontSrc) {
  const id = fontName.replace(/\s/g, '');
  if (!document.querySelector('#' + id)) {
      const style = document.createElement('style');
      style.setAttribute('id', id)
      style.innerText = `@font-face { font-family: '${fontName}'; src: url('${fontSrc}'); }`;
      document.head.appendChild(style);
  }
}
