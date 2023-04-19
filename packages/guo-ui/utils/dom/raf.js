const isServer = false

const root = isServer ? global : window
let prev = Date.now();

/* istanbul ignore next */
function fallback(fn) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}
const iRaf = root.requestAnimationFrame || fallback

export function raf(fn) {
  return iRaf.call(root, fn)
}

export function doubleRaf(fn) {
  raf(() => {
    raf(fn)
  })
}