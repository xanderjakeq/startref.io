import React, { Component } from 'react';

const Reference = (props) => {

    return(
        <div className="refs">
            <a href = {props.photoInfo.urls.regular} target="_blank"><img src = {props.photoInfo.urls.small}></img></a>
            <p className = "author">by <a href={props.photoInfo.user.links.html} target="_blank"> {props.photoInfo.user.first_name} </a></p>
        </div>
    );
}

export default Reference;
