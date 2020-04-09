export default function ResizeColumnsBuilder() {
  const cache = Object.create(null);

  this.start = function (e) {
    const index = +e.target.dataset.index;

    cache.x = e.pageX;
    cache.columns = cache.columns || e.target.parentElement.parentElement.children;

    cache.col1 = cache.columns[index];
    cache.width1 = parseInt(cache.col1.getAttribute('width'));

    cache.col2 = cache.columns[index + 1];
    cache.width2 = parseInt(cache.col2.getAttribute('width'));

    window.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mouseup', removeMouseMove, true);
  }

  function onMouseMove (e) {
    const diff = e.pageX - cache.x;

    cache.col1.setAttribute('width', cache.width1 + diff);
    cache.col2.setAttribute('width', cache.width2 - diff);
  }

  function removeMouseMove  () {
    window.removeEventListener('mousemove', onMouseMove, true);
    window.removeEventListener('mouseup', removeMouseMove, true);
  }
}
