export function toggle(key) {
  return (event, currentProps, setState) =>
    setState({[key]: !currentProps[key]})
  ;
}

export function bind(key) {
  return (value, currentProps, setState) =>
    setState({[key]: value})
  ;
}

export function set(values) {
  return (event, currentProps, setState) =>
    setState(values)
  ;
}
