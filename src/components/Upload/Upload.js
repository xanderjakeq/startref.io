import React, { Component } from 'react';
import firebase from 'firebase';
import {Redirect, Link, Route} from 'react-router-dom';

import './Upload.css';

import Post from '../Post/Post';
import OPtions from '../Options/Options';

import firebaseApp from '../config/firebaseApp';
import UploadButton from '../UploadButton/UploadButton';
import Ref from '../Ref/Ref'
import Scribble from '../Scribble/Scribble'
import RefSet from '../RefSet/RefSet'

let database = firebase.database().ref();


class Upload extends Component {

    constructor(props){
        super(props)

        this.state = {
            user: firebase.auth().currentUser,
            // userData: {},
            // name: props.user.displayName,
            username:'',
            // photoURL: props.user.photoURL
            savedRefs: [],
            refKeys: []

        }
    }



    componentWillMount(){
        console.log(this.props)
        database.child('Users/' + this.state.user.uid).on('value', snap => {
            console.log(snap.val())
            let val = snap.val();
            if(val !== null){
                this.setState({
                    userData: val,
                });
            }
        });

        database.child('UserGroupedRefs/' + this.state.user.uid).on('value', snap => {
            console.log(snap.val())

            let refsObjToArray = Object.keys(snap.val()).map(function(key) {
                let itemKey = key;
                return {refKey: key, data:snap.val()[key]};
              });

            this.setState({
                savedRefs: refsObjToArray,
            })
        });
    }

    render(){
        let refsObject = this.state.savedRefs;
        const refRendered =   refsObject.map((ref) => {
            return (
                <RefSet data = {ref.data} key = {ref.refKey}/>
            )
        });
        
        console.log(refRendered)

        return(
            <div className = "profileWrapper">
                {/* profile info */}

                <div className = "postsWrapper">
                    {refRendered}
                </div>

                <div className = "uploadButtonWrapper">
                    <UploadButton content = "(*•̀ᴗ•́*)و ̑̑" linkTo="/explore"/>
                </div>
            </div>
        )
    }


}

export default Upload;