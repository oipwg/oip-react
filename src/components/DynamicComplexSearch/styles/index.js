// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const styles = {
  flex: {
    display: 'flex'
  },
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
  buttonBase: {
    backgroundColor: 'white',
    border: 'none'
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
  inputQuery: {
    extend: 'selectBase',
    position: 'relative',
    top: '-1px'
  },
  andSpan: {
    margin: 10,
    extend: 'flex',
    alignItems: 'center'
  },
  inputDatalist: {
    extend: 'selectBase'
  },
  removeButton: {
    extend: 'buttonBase'
  },
  queryContainer: {
    extend: 'flex',
    maxWidth: 500,
    flexWrap: 'wrap'
  },
  dateTimePicker: {
    extend: 'flex'
  },
  datePicker: {
    extend: 'flex'
  },
  timePicker: {
    extend: 'flex'
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  addButton: {
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D3D3D3',
      color: 'white'
    },
    height: 30,
    width: 80
  },
  submitButton: {
    marginLeft: '10px',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D3D3D3',
      color: 'white'
    },
    height: 30,
    width: 80
  }
}

export default styles
