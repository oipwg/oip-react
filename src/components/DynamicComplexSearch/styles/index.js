// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const styles = {
  // containers
  root: {
    display: 'inline-flex',
    flexDirection: 'column'
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px',
    width: '500px',
    flexWrap: 'wrap'
  },
  queryContainer: {
    display: 'flex',
    maxWidth: 500,
    flexWrap: 'wrap'
  },
  dateTimePicker: {
    display: 'flex'
  },
  datePicker: {
    display: 'flex'
  },
  timePicker: {
    display: 'flex'
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  // selects and inputs
  selectBase: {
    backgroundColor: 'white',
    border: 'none',
    borderBottom: '1px solid red',
    margin: [0, 5, 10],
    fontSize: 14,
    padding: 3,
    cursor: 'default',
    '&:hover': {
      backgroundColor: '#F8F8F8'
    }
  },
  inputBase: {
    extend: 'selectBase'
  },
  selectField: {
    extend: 'selectBase'
  },
  selectOption: {
    extend: 'selectBase'
  },
  selectOp: {
    extend: 'selectBase'
  },
  // inputs
  inputQuery: {
    extend: 'selectBase',
    position: 'relative',
    top: '-1px'
  },
  inputDatalist: {
    extend: 'inputBase'
  },
  // buttons
  buttonBase: {
    backgroundColor: 'white',
    border: 'none'
  },
  fnButtons: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D3D3D3',
      color: 'white'
    },
    height: 30,
    width: 80
  },
  addButton: {
    extend: ['buttonBase', 'fnButtons']
  },
  submitButton: {
    extend: ['buttonBase', 'fnButtons'],
    marginLeft: '10px'
  },
  removeButton: {
    extend: 'buttonBase'
  },
  // spans
  andSpan: {
    margin: 10,
    extend: 'flex',
    alignItems: 'center'
  }
}

export default styles
