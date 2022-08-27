import React, {useState, useEffect} from "react";
import '../styles/PDFAnnotator.css';

import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import { Section } from "react-trello/dist/styles/Base";
import { getStorageProjID, useProjID } from "../context/ProjectID";
import { getStorageToken } from "../context/Auth";


const URL = process.env.REACT_APP_API_URL;

const updateHash = (highlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

export default function PDFSidebar(props) {
    const [commentData, setCommentData] = useState([]);
    
    const formatHighlight = (data, text) => {
        return (
                <div>
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

    const prepCommentData = (data) => {
        let comments = []
        let highlights = []
        data.map((item, index)=> {
            comments.push({
                userId: item.user.id,
                comId: item.id,
                fullName: item.user.username,
                text: item.highlight_metadata ? formatHighlight(item.highlight_metadata, item.text) : item.text,
                avatarUrl: `https://ui-avatars.com/api/name=${item.user.username}&background=random`,
                replies: []
            })

            if(item.highlight_metadata) highlights.push(item.highlight_metadata)
        })
        console.log("Data reformatted : ", comments)
        setCommentData(comments)
        props.setHighlights(highlights)
    }

    const addComment = (data) => {
        // console.log("Add this : ", highlight)
        fetch(URL + `api/submissions/1/comments/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                "text": data.text,
                "submission_id": 1,
                "reviewer_thread": 2,
                "highlight_metadata": props.curHighlight
             })
        })
        .then(res=>{
            props.setCurHighlight(null);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const fetchCommentData = () => {
        let url = `api/submissions/1/comments/`;
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
            <h2 style={{ marginBottom: "1rem" }}>Current HighLight</h2>
    
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
            currentUserId: 1,
            currentUserFullName: 'Tahmeed Tarek',
            currentUserImg: `https://ui-avatars.com/api/name=Tahmeed_Tarek&ground=random`,
            }}
            logIn={{
            loginLink: 'http://localhost:3001/',
            signupLink: 'http://localhost:3001/'
            }}
            commentData={commentData}
            removeEmoji={true}
            onSubmitAction={(data) => { console.log('check submit, ', data); addComment(data); fetchCommentData(); }}
            onReplyAction={(data) => { console.log('check reply, ', data); addComment(data); fetchCommentData(); }}
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