import React, {useState, useEffect} from "react";
import { PdfLoader, PdfHighlighter, Tip, Highlight, Popup, AreaHighlight } from "react-pdf-highlighter";

import '../styles/PDFAnnotator.css';


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

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
// let scrollViewerTo = (highlight) => {return highlight};

export default function PDFAnnotator(props) {
    console.log("here -> ", props.url)
    // props.handleModalClose();
    const [highlights, setHighlights] = useState([]);
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
    
    const addHighlight = (highlight) => {
        console.log("Saving highlight", highlight);

        setHighlights([{ ...highlight, id: getNextId() }, ...highlights])
    }
 
    const updateHighlight = (highlightId, position, content) => {
        console.log("Updating highlight", highlightId, position, content);
    }

    return (
        <div className="PDFAnnotator" style={{ display: "flex", height: "100vh" }}>
            {/* <Sidebar
            highlights={highlights}
            resetHighlights={this.resetHighlights}
            toggleDocument={this.toggleDocument}
            /> */}
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
    )
}