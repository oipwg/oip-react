import React, { Component } from 'react';
import { connect } from 'react-redux';

class StoreDebugHelper extends Component {
	constructor(props){
		super(props)
	}
	render(){
		let debug_value = this.props.state

		try {
			for (var key of this.props.path) {
				debug_value = debug_value[key]
			}
		} catch (e) {
			debug_value = "undefined"
		}

		let debug_string

		if (typeof debug_value === "object"){
			debug_string = JSON.stringify(debug_value, null, 4)
		} else {
			debug_string = debug_value.toString()
		}

		let p = this.props.path;
		let l = this.props.path.length-1;
		let m = this.props.minimize;

    	return (
		    <p style={this.props.style}><strong>{m ? p[l] : p.join(".")}:</strong> {debug_string}</p>
	    )
	}
}

function mapStateToProps(state) {
    return {
        state
    }
}

export default connect(mapStateToProps)(StoreDebugHelper)