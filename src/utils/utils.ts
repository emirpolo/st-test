/**
 * Gets the value at `path` of `obj`. If the resolved value is _undefined_, the `def` is returned in its place.
 * @param obj
 * @param path
 * @param def
 *
 * @example
 * ```javascript
  const object = { 'a': [{ 'b': { 'c': 3 } }] };
  _get(object, 'a[0].b.c'); // => 3
  _get(object, 'a.b.c', 'default'); // => 'default'
 ```
 */
export function _get(obj: object, path: string, def?: any) {
  let out;
  const pathList = path.replace(/\[/g, '.').replace(/]/g, '').split('.');

  for (const p of pathList) {
    out = (out || obj)[p];
    if (out === undefined)
      return def;
  }

  return out;
}


export function _omit(obj: object, props: string[]) {
  let out = {};
  for (const k in obj) {
    if (!props.includes(k))
      out[k] = obj[k];
  }
  return out;
}


export function _size(obj: object) {
  return Object.keys(obj || '').length;
}


export function _isEmpty(obj: object) {
  return _size(obj) === 0;
}


export function debounce(fn: Function, time = 500) {
  let timeout;

  return function (...args) {
    const functionCall = () => fn.apply(this, args);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}


export function throttled(fn: Function, delay = 500) {
  let lastCall = 0;
  return (...args) => {
    const now = (new Date()).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}


export function loadScript(url: string) {
  return new Promise(resolve => {
    document.head.appendChild(Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      defer: true,
      onload: resolve,
      src: url
    }))
  });
}

interface IScriptItem {
  url: string;
  namespace?: string | Function;
  dependencies?: IScriptItem[];
}
type TScriptItem = string | IScriptItem;
/**
 * Import a set of external Scripts from CDN in both serie and cascade way
 * @param scripts can be an array of string or an array of object with the follow structure:
 * @property url: String - CDN URL
 * @property namespace: String or Function - if is a String, that name is evaluated on Window[namespace] object otherwise the Function is invoked expecting a Thrutly value
 * @property dependencies: an array with the same structure to load in cascade mode
 */
export function importScripts(scripts: TScriptItem[]) {
  const promiseList = scripts.map(script => {
    if (typeof script === 'string') {
      return loadScript(script);
    } else {
      if (script.namespace) {
        const exist = typeof script.namespace === 'function'
          ? script.namespace() : window[script.namespace];

        if (exist) {
          return importScripts(script.dependencies);
        } else {
          return loadScript(script.url).then(_ => importScripts(script.dependencies));
        }
      } else {
        return loadScript(script.url).then(_ => importScripts(script.dependencies));
      }
    }
  });

  return Promise.all(promiseList);
}

