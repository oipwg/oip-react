import React from 'react';
import withStyles from 'react-jss'


const styles = {
    Feedback: {
        fontSize: '14px'
    }
  }


const Feedback = ({classes, message }) => {
    return (
        <div className={classes.Feedback }role="alert">
            <p>
                {message}
            </p>
        </div>
    )
}



export default withStyles(styles)(Feedback);