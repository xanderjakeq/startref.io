import React, { } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Post = (props) => {
    return( 
        <Wrapper>
            <Link to = {props.url}>
                <Art src={props.post.data.artLink} onClick = {props.click(props.post)} alt = 'art'/>       
            </Link>
        </Wrapper>
    )
}

export default Post;

Post.propTypes = {
    url: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    click: PropTypes.func.isRequired
}

const Wrapper = styled.div`
    width: 100px;
    margin: 1px; 

    @media only screen and (min-width: 350px) {
        margin: 5px; 
    }
    @media only screen and (min-width: 700px) {
        width: 200px;
        margin: 10px; 
    }
`;

const Art = styled.img`
    display: block;
    width: 100%;
    height: 100%;
`;