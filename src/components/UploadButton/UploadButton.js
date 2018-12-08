import React, { Component } from 'react';
import {Link} from "react-router-dom";
import './UploadButton.css';

const UploadButton = (props) => {
    // console.log(props)
    return(
        <button id = "uploadButton" className = "generate-btn">
                <Link to = {props.linkTo}><span className = "uploadButtonIcons">{props.content}</span></Link>
        </button>
    )
}

export default UploadButton;