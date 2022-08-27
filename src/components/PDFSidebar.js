import React, {useState, useEffect} from "react";
import '../styles/PDFAnnotator.css';

import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import { Section } from "react-trello/dist/styles/Base";
import { getStorageProjID, useProjID } from "../context/ProjectID";
import { getStorageToken } from "../context/Auth";
import { useUser, removeStorageUser } from '../context/User';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';

const URL = process.env.REACT_APP_API_URL;

const updateHash = (highlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

export default function PDFSidebar(props) {
    const [commentData, setCommentData] = useState([]);
    const { user } = useUser();
    
    const formatHighlight = (data, text) => {
        return (
                <div onClick={()=>{console.log("hehe")}}>
                    <div>
                        {data.content.text ? (
                        <blockquote style={{ marginTop: "0.5rem", backgroundColor: "yellow"}}>
                            {`${data.content.text.slice(0, 90).trim()}…`}
                        </blockquote>
                        ) : null}
                        {data.content.image ? (
                        <div
                            className="highlight__image"
                            style={{ marginTop: "0.5rem" }}
                        >
                            <img src={data.content.image} alt={"Screenshot"} />
                        </div>
                        ) : null}
                    </div>
                    <div className="highlight__location">
                        Page {data.position.pageNumber}
                    </div>
                    <strong>{text}</strong>
                </div>
        )
    }


    const singleData = (item) => {
        return {
            userId: item.user.id,
            comId: item.id,
            fullName: item.user.username,
            text: item.highlight_metadata ? formatHighlight(item.highlight_metadata, item.text) : item.text,
            avatarUrl: `https://ui-avatars.com/api/name=${item.user.username}&background=random`,
        }
    }
 
    const prepCommentData = (data) => {
        let comments = []
        let highlights = []
        data.map((item, index)=> {
            comments.push({
                ...singleData(item),
                replies: item.replies.map((reply)=>singleData(reply))
            })

            if(item.highlight_metadata) highlights.push(item.highlight_metadata)
        })
        console.log("Data reformatted : ", comments)
        setCommentData(comments)
        props.setHighlights(highlights)
    }

    const addComment = (data, parent_id) => {
        // console.log("Add this : ", highlight)
        let payload = { 
            "text": data.text,
            "submission_id": props.sub_id,
            "reviewer_thread": props.reviewer_id,
            "highlight_metadata": props.curHighlight
        }
        if(parent_id != -1) payload["parent_id"] = parent_id

        console.log("Payload : ", payload)
        fetch(URL + `api/submissions/${props.sub_id}/comments/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res=>{
            props.setCurHighlight(null);
            fetchCommentData();
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const fetchCommentData = () => {
        let url = `api/submissions/${props.sub_id}/comments/?reviewer_thread=${props.reviewer_id}`;
        fetch(URL + url, 
        {
            method: 'GET',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            }
        })
        .then(resp=>{
            if (resp.status >= 400) throw new Error();
            return resp.json();
        })
        .then(resp=>{
            console.log("Comments Data : ", resp.results)
            prepCommentData(resp.results);

        })
        .catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        fetchCommentData();
    }, [])

    // props -> highlights
    return (
        <div className="sidebar" style={{ width: "25vw" }}>
            
          <div className="description" style={{ padding: "1rem" }}>
    
            <Button 
                variant="outlined" 
                size="large" 
                startIcon={<ArrowBackIcon />}
                style={{borderColor: "black", color: "black"}}
                onClick={()=>{props.handleClose()}}
                // color="black"
            >BACK</Button>

            <h2 style={{ marginBottom: "1rem" }}>Current Highlight</h2>
            
            {/* <p style={{ fontSize: "0.7rem" }}>
              <a href="https://github.com/agentcooper/react-pdf-highlighter">
                Open in GitHub
              </a>
            </p> */}
    
            <p>
              <small>
                To create area highlight hold ALT, then click and
                drag.
              </small>
            </p>
          </div>
    
          {
            props.curHighlight && 
            <ul className="sidebar__highlights">
                <li
                className="sidebar__highlight"
                onClick={() => {
                    updateHash(props.curHighlight);
                }}
                >
                <div>
                    {props.curHighlight.content.text ? (
                    <blockquote style={{ marginTop: "0.5rem", backgroundColor: "yellow"}}>
                        {`${props.curHighlight.content.text.slice(0, 90).trim()}…`}
                    </blockquote>
                    ) : null}
                    {props.curHighlight.content.image ? (
                    <div
                        className="highlight__image"
                        style={{ marginTop: "0.5rem" }}
                    >
                        <img src={props.curHighlight.content.image} alt={"Screenshot"} />
                    </div>
                    ) : null}
                </div>
                <div className="highlight__location">
                    Page {props.curHighlight.position.pageNumber}
                </div>
                </li>
            </ul>
            
          }
          
          <CommentSection
            currentUser={{
            currentUserId: user[0],
            currentUserFullName: user[1],
            currentUserImg: `https://ui-avatars.com/api/name=Tahmeed_Tarek&ground=random`,
            }}
            logIn={{
            loginLink: 'http://localhost:3001/',
            signupLink: 'http://localhost:3001/'
            }}
            commentData={commentData}
            removeEmoji={true}
            onSubmitAction={(data) => { console.log('check submit, ', data); addComment(data, -1); ; }}
            onReplyAction={(data) => { console.log('check reply, ', data); addComment(data, data.repliedToCommentId); }}
            // currentData={(data) => {
            //     console.log('curent data', data)
            // }}
        />      

          {/* <ul className="sidebar__highlights">
            {props.highlights.map((highlight, index) => (
              <li
                key={index}
                className="sidebar__highlight"
                onClick={() => {
                  updateHash(highlight);
                }}
              >
                <div>
                  <strong>{highlight.comment.text}</strong>
                  {highlight.content.text ? (
                    <blockquote style={{ marginTop: "0.5rem" }}>
                      {`${highlight.content.text.slice(0, 90).trim()}…`}
                    </blockquote>
                  ) : null}
                  {highlight.content.image ? (
                    <div
                      className="highlight__image"
                      style={{ marginTop: "0.5rem" }}
                    >
                      <img src={highlight.content.image} alt={"Screenshot"} />
                    </div>
                  ) : null}
                </div>
                <div className="highlight__location">
                  Page {highlight.position.pageNumber}
                </div>
              </li>
            ))}
          </ul> */}
          {/* <div style={{ padding: "1rem" }}>
            <button onClick={toggleDocument}>Toggle PDF document</button>
          </div> */}
          {/* {highlights.length > 0 ? (
            <div style={{ padding: "1rem" }}>
              <button onClick={resetHighlights}>Reset highlights</button>
            </div>
          ) : null} */}
        </div>
      );
}