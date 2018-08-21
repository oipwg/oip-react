import React, { Component } from 'react'
import oip from '../oip.svg'
import { Index } from 'oip-index';

class ImageViewer extends Component {
    constructor(props){
        super(props)
    }
    render() {

        return (
            <div className="d-flex justify-content-center" style={{height: "100%"}}>
                <img style={{backgroundColor: "#fff", maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} src={oip} alt="Your image is supposed to be here!" />
            </div>
        );
    }
}

export default ImageViewer;