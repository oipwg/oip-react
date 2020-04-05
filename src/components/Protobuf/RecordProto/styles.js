const fieldHeight = 25
const fieldWidth = 250
const marginTopForTitle = 15

const styles = theme => ({
  root: {
    width: fieldWidth
    // marginLeft: 'auto',
    // marginRight: 'auto'
  },
  inputField: {
    width: fieldWidth,
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10
    }
  },
  selectField: {
    width: fieldWidth,
    height: fieldHeight,
    boxSizing: 'border-box',
    padding: 4,
    background: 'none',
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    fontSize: 12
  },
  fieldContainer: {
    position: 'relative'
  },
  fieldTitle: {
    fontSize: 10,
    color: `${theme.palette.greyscale(0.8)}`,
    position: 'absolute'
  },
  // tags input
  tagsInputRoot: {
    width: fieldWidth,
    boxSizing: 'border-box',
    marginTop: marginTopForTitle,
    marginBottom: 10,
    border: `1px solid ${theme.palette.greyscale(0.3)}`,
    borderRadius: 3,
    height: fieldHeight,
    position: 'relative',
    '& > input': {
      width: fieldWidth,
      position: 'relative',
      boxSizing: 'border-box'
    }
  },
  input: {
    width: fieldWidth,
    fontSize: 12,
    '&::placeholder': {
      fontSize: 10
    },
    boxSizing: 'border-box'
  }
})

export default styles
