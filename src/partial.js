export default function partial(fn, ...args) {
  return fn.bind(null, ...args)
}
