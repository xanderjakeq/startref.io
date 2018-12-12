import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';
import firebase from 'firebase';

import '../UserProfile/UserProfile.css';
import './Explore.css';

import Post from '../Post/Post';
import ArtWithRef from '../ArtWithRef/ArtWithRef'
import PostOverlay from '../PostOverlay/PostOverlay'

let activePost = {};

class Explore extends Component {
    

    constructor(props){
        super(props)

        this.state = {
            activePost: '',
            pageRefKey: null,
            firebaseRef: firebase.database().ref(),
            posts:[],
            perPage: 16,
            endReached: false,
            scrolling: false
        }

        this.handlePostClick = this.handlePostClick.bind(this)
        this.loadPosts = this.loadPosts.bind(this)
    }

    handlePostClick(post){
        this.state.activePost = post


        // doesn't work dunno why
        // this.setState({
        //     activePost: post,
        // })
    }

    componentWillMount(){
        if(!this.state.pageRefKey){
            firebase.database().ref().child('Posts').orderByKey().limitToLast(1).on('value', async (childSnapshot, prevChildKey) => {
            
                console.log(childSnapshot.val())
    
                let postsObjToArray = Object.keys(childSnapshot.val()).map(function(key) {
                    return {refKey: key, data:childSnapshot.val()[key]};
                });
                // console.log(postsObjToArray.pop().refKey)
                //can't call setState if component didn't mount yet (shouldn't)
                this.setState({
                    pageRefKey: await postsObjToArray.pop().refKey
                }) 
                console.log(this.state.pageRefKey)
                this.loadMore()
            })
        }

        // add Scroll Listener

        this.scrollListener = window.addEventListener('scroll', this.handleScroll)
        
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll = () => {
        const { scrolling, totalPages, page} = this.state
        if (scrolling) return
        if (totalPages <= page) return
        var lastLi = document.querySelector('div.grid > div:last-child')
        var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight
        var pageOffset = window.pageYOffset + window.innerHeight
        var bottomOffset = 20
        if (pageOffset > lastLiOffset - bottomOffset) {
          this.loadMore()
        }
        
      }

    loadPosts(){
        //prevent fetching if endisReached
        if(this.state.endReached){return}

        this.state.firebaseRef.child('Posts').orderByKey().endAt(this.state.pageRefKey).limitToLast(this.state.perPage).on('value', (childSnapshot, prevChildKey) => {
            
            console.log(childSnapshot.val())

            let postsObjToArray = Object.keys(childSnapshot.val()).map(function(key) {
                let itemKey = key;
                return {refKey: key, data:childSnapshot.val()[key]};
            });

            postsObjToArray.reverse()
            
            console.log(this.state.pageRefKey)
            
            this.setState({
                //prevent updating pageRefKey if the current number of items is less than perPage
                pageRefKey: postsObjToArray.length < this.state.perPage ? this.setState({endReached: true}) : postsObjToArray.pop().refKey, 
                // posts:[...this.state.posts, ...postsObjToArray.reverse()]
                posts:[...this.state.posts, ...postsObjToArray],
                scrolling: false
            })

            console.log(this.state.pageRefKey)
            
            
            // console.log(childSnapshot.key)
            
            // if(counter === 0){
            //     this.setState({
            //         pageRefKey: childSnapshot.key
            //     })
            // }
            // counter++
            // // if (!this.state.firstKnownKey) {
            //     this.setState({
            //         // firstKnownKey: childSnapshot.key,
            //         posts: [...this.state.posts, {refKey: childSnapshot.key, data: childSnapshot.val()}]
            //     })
              
            // // }
        });
        
        console.log(this.state.pageRefKey)
        console.log(this.state.posts)
    }

    loadMore = () => {
        this.setState(prevState => ({
          page: prevState.page+1,
          scrolling: true,
        }), this.loadPosts)
      }


    // console.log(props)
    render(){
        console.log(this.props)

        let postsArray = this.state.posts;
        let postRendered = [];
        if(postsArray != null){
            postRendered =   postsArray.map((post) => {
                console.log(post.refKey)
                return (
                    // TODO: move postWrapper CSS to explore.css
                    <div className = "postWrapper" key = {post.refKey}>
                     <Link to = {`${this.props.match.url}/${post.refKey}`}>
                        <Post post = {post} key = {post.refKey} onClick = {this.handlePostClick}/>
                     </Link>
                    </div>
                )
            });
        }   
        return(
            <div className = "profileWrapper">               
                <div className = "postsWrapper">
                    
                <Route path= {`${this.props.match.url}/:postID`} component = {PostOverlay}  />

                    <div className = "grid">
                        {postRendered}
                    </div>
                    {console.log(this.props.match.path)}
                    
                </div>
            </div>
        )
    }

}



export default Explore;