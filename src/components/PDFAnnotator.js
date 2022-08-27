import React, {useState, useEffect} from "react";
import { PdfLoader, PdfHighlighter, Tip, Highlight, Popup, AreaHighlight } from "react-pdf-highlighter";
import Modal from '@mui/material/Modal';

import '../styles/PDFAnnotator.css';
import PDFSidebar from "./PDFSidebar";
import { getStorageToken } from "../context/Auth";

const URL = process.env.REACT_APP_API_URL;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1080px', //'auto',
    maxWidth: '1080px',
    height: '500px',
    maxHeight: '500px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = (comment) => {
    return (comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null);
}

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";
const searchParams = new URLSearchParams(document.location.search);


// const highlight1 = {
//     "content": {
//       "text": "Contact Number: +8801833182774 ,"
//     },
//     "position": {
//       "boundingRect": {
//         "x1": 352.4206237792969,
//         "y1": 372.2308654785156,
//         "x2": 599.5476989746094,
//         "y2": 394.157958984375,
//         "width": 824,
//         "height": 1165.5741285174297,
//         "pageNumber": 1
//       },
//       "rects": [
//         {
//           "x1": 352.4206237792969,
//           "y1": 372.2308654785156,
//           "x2": 599.5476989746094,
//           "y2": 394.157958984375,
//           "width": 824,
//           "height": 1165.5741285174297,
//           "pageNumber": 1
//         }
//       ],
//       "pageNumber": 1
//     },
//     "comment": {
//       "text": "hello",
//       "emoji": ""
//     }
//   }
  
const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
// let scrollViewerTo = (highlight) => {return highlight};

export default function PDFAnnotator(props) {
    console.log("here -> ", props.url, props.highlight)
    // props.handleModalClose();
    const [highlights, setHighlights] = useState(props.highlight);
    // const [url, setUrl] = useState(props.url);

    const resetHighLights = () => {
        setHighlights([])
    }

    const scrollToHighlightFromHash = () => {
        const highlight = getHighlightById(parseIdFromHash());
    
        // if (highlight) {
        //   scrollViewerTo(highlight);
        // }
    };

    const getHighlightById = (id) => {    
        return highlights.find((highlight) => highlight.id === id);
    }
    
    const addComment = (highlight) => {
        console.log("Add this : ", highlight)
        fetch(URL + `api/submissions/1/comments/`, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                "text": "Very nice work done here",
                "submission_id": 1,
                "reviewer_thread": 2,
                "highlight_metadata": highlight
             })
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const addHighlight = (highlight) => {
        console.log("Saving highlight", JSON.stringify(highlight));

        setHighlights([{ ...highlight, id: getNextId() }, ...highlights])

        console.log("Adding hightlight .. ", highlight)
        addComment(highlight);        
    }
 
    const updateHighlight = (highlightId, position, content) => {
        console.log("Updating highlight", highlightId, position, content);
    }

    return (
        <Modal
          open={props.isOpen}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <div className="PDFAnnotator" style={{ display: "flex", height: "100vh", backgroundColor: "white"}}>
                <PDFSidebar
                highlights={highlights}
                // resetHighlights={this.resetHighlights}
                />
                <div
                style={{
                    height: "100vh",
                    width: "75vw",
                    position: "relative",
                }}
                >
                <PdfLoader url={props.url}>
                    {(pdfDocument) => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection={(event) => event.altKey}
                        onScrollChange={resetHash}
                        // pdfScaleValue="page-width"
                        scrollRef={(scrollTo) => {
                            // scrollViewerTo = scrollTo;
                            scrollToHighlightFromHash();
                        }}
                        onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection,
                            transformSelection
                        ) => (
                        <Tip
                            onOpen={transformSelection}
                            onConfirm={(comment) => {
                                addHighlight({ content, position, comment });
                                hideTipAndSelection();
                            }}
                        />
                        )}
                        highlightTransform={(
                            highlight,
                            index,
                            setTip,
                            hideTip,
                            viewportToScaled,
                            screenshot,
                            isScrolledTo
                        ) => {
                        const isTextHighlight = !Boolean(
                            highlight.content && highlight.content.image
                        );
        
                        const component = isTextHighlight ? (
                            <Highlight
                            isScrolledTo={isScrolledTo}
                            position={highlight.position}
                            comment={highlight.comment}
                            />
                        ) : (
                            <AreaHighlight
                            isScrolledTo={isScrolledTo}
                            highlight={highlight}
                            onChange={(boundingRect) => {
                                updateHighlight(
                                highlight.id,
                                { boundingRect: viewportToScaled(boundingRect) },
                                { image: screenshot(boundingRect) }
                                );
                            }}
                            />
                        );
        
                        return (
                            <Popup
                            popupContent={<HighlightPopup {...highlight} />}
                            onMouseOver={(popupContent) =>
                                setTip(highlight, (highlight) => popupContent)
                            }
                            onMouseOut={hideTip}
                            key={index}
                            children={component}
                            />
                        );
                        }}
                        highlights={highlights}
                    />
                    )}
                </PdfLoader>
                </div>
            </div>
        </Modal>
    )
}