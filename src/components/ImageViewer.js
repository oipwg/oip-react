import React, { Component } from 'react'
import oip from '../oip.svg'
// import { Index } from 'oip-index';

class ImageViewer extends Component {
    constructor(props){
        super(props)
    }
    render() {

        return (
            <div className="d-flex justify-content-center">
                <img style={{backgroundColor: "#fff", objectFit: 'contain'}} src={oip} alt="Your image is supposed to be here!" />
            </div>
        );
    }
}

export default ImageViewer;