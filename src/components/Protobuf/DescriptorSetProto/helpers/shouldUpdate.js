const shouldUpdate = (oldProps, newProps) => {
  const nameDidNotChange = oldProps.state[oldProps.name] === newProps.state[newProps.name]
  const classesDidNotChange = oldProps.classes === newProps.classes
  return nameDidNotChange && classesDidNotChange
}

export default shouldUpdate
