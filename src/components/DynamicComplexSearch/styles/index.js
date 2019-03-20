// Create your Styles. Remember, since React-JSS uses the default preset,
// most plugins are available without further configuration needed.
const styles = {
  flex: {
    display: 'flex',
  },
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px'
  },
  baseSelect: {
    backgroundColor: 'white',
    border: 'none',
    borderBottom: '1px solid red',
    marginRight: '10px',
    fontSize: 14,
    padding: 3,
    cursor: 'default',
    '&:hover': {
      backgroundColor: '#F8F8F8'
    }
  },
  baseButton: {
    backgroundColor: 'white',
    border: 'none',
  },
  selectField: {
    extend: 'baseSelect'
  },
  selectOption: {
    extend: 'baseSelect'
  },
  selectOp: {
    extend: 'baseSelect'
  },
  inputQuery: {
    extend: 'baseSelect',
    position: 'relative',
    top: '-1px'
  },
  spanBetween: {
    marginRight: '10px',
    extend: 'flex',
    alignItems: 'center',
  },
  inputDatalist: {
    extend: 'baseSelect'
  },
  removeButton: {
    extend: 'baseButton',
  },
  dateTimePickerContainer: {
    extend: 'flex',
  },
  dateTimePicker: {
    extend: 'flex',
  },
  datePicker: {
    extend: 'flex',
  },
  timePicker: {
    extend: 'flex',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
  backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D3D3D3',
      color: 'white',
    },
    height: 30,
    width: 80,
  },
  submitButton: {
    marginLeft: '10px',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D3D3D3',
      color: 'white',
    },
    height: 30,
    width: 80,
  },
}

export default styles
