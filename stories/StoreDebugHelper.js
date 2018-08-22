import React, { Component } from 'react';
import { connect } from 'react-redux';

class StoreDebugHelper extends Component {
	constructor(props){
		super(props)
	}
	render(){
		let debug_value = this.props.state

		try {
			for (var key of this.props.path)
				debug_value = debug_value[key]
		} catch (e) {
			debug_value = "undefined"
		}

    	return (
            <p><strong>{this.props.path.join(".")}:</strong> {debug_value.toString()}</p>
        )
	}
}

function mapStateToProps(state) {
    return {
        state
    }
}

export default connect(mapStateToProps)(StoreDebugHelper)