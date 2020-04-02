import React from 'react'
import withStyles from 'react-jss'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 auto',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  navItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1',
    padding: [5, 10],
    cursor: 'pointer',
    justifyContent: 'center'
  }
})

const ActionNavBar = ({
  classes,
  navItems = [],
  activeNavLink,
  onNavLinkClick,
  theme
}) => {
  function activeNavLinkStyle (item) {
    if (item === activeNavLink) {
      return {
        borderBottom: `2px solid ${theme.palette.primary.main}`
      }
    }
  }
  return <div className={classes.root}>
    {navItems.map((item, i) => {
      return <div
        key={i}
        className={classes.navItemContainer}
        onClick={() => onNavLinkClick(item)}
        style={activeNavLinkStyle(item)}
      >
        <span>{item}</span>
      </div>
    })}
  </div>
}

export default withStyles(styles, { injectTheme: true })(ActionNavBar)
