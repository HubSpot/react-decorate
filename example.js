const PREFIX = 'uid'

let nextId = 0

export const makeUniqueId = () => {
  let ids = {}
  return keyStr => {
    if (!ids.hasOwnProperty(keyStr)) {
      ids[keyStr] = `${PREFIX}-${keyStr}-${nextId++}`
    }
    return ids[keyStr]
  }
}

partial('partial')(Component)

Apply(
  partial('partial'),
  uncontrollable('value', 'setValue'),
)(Component);
