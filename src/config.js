import invariant from 'invariant'

function enforceRequired(key, config) {
  const fn = config[key]
  invariant(
    typeof fn === 'function',
    'Invalid config. expected `%s` to be a function but got `%s`',
    key,
    fn
  )
}

function enforceOptional(key, config) {
  const fn = config[key]
  invariant(
    typeof fn === 'function' || fn === undefined,
    'Invalid config. expected `%s` to be a function or undefined but got `%s`',
    key,
    fn
  )
}

export function enforceValidConfig(config) {
  enforceRequired('displayName', config)
  enforceOptional('defaultProps', config)
  enforceOptional('propTypes', config)
  enforceRequired('nextProps', config)
  enforceOptional('unmount', config)
  return config
}
