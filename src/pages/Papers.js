import React, { useState, useEffect } from "react";
import Board from 'react-trello'
import '../styles/Kanban.css' // for some teason this doesnt work when refreshing? :/ 

import PaperModal from '../components/PaperModal'
import KBCard from '../components/KBCard'
import { getStorageToken } from "../context/Auth";
import { useProjID } from "../context/ProjectID";
import { Box } from "@mui/material";
/*  
    kanban board data format:
    data = { lanes: [
        {
        id: 'lane1',
        title: 'Planned Tasks',
        label: '2/2',
        cards: [
            {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: false},
        ]},
    ]}   
*/

const URL = process.env.REACT_APP_API_URL;

const boardStyle = {
    'backgroundColor': 'inherit',
    // 'borderRadius': '50px',
}

const laneStyle = {
    border: '1px solid #3F3C3C',
    backgroundColor: '#f3f3f3', 
    borderRadius: '15px', 
    // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.75)'
}
  
const cardStyle = {
    border: '1px solid #3F3C3C',
    borderRadius: '15px',
}

export default function Papers() {

    const { projID } = useProjID();
    const [data, setData] = useState({lanes: [{id: 'loading', title: 'loading..', cards: []}]});
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [laneToID, setLaneToID] = useState({});
    
    /////////////////////////////////// FETCH CARDS
    const fetchCards = (laneData) => {
        fetch(URL + `api/projects/${projID}/papers`,
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
                resp.results.forEach((item, index) => {
                    laneData.forEach(lane => {
                        if(lane.id == item.list) {
                            lane.cards.push({
                                // most probably id is project paper id and paper_id is paper id
                                id: item.id.toString(), title: item.paper.name, description: item.paper.authors, label: 'Done', draggable: true, metadata: {paper_id: item.paper_id, title: item.paper.name}
                            })
                        }
                    })
                })
                setData({lanes: laneData});
                console.log("HEREEEEEEEEEEEEE ", data);
            })
            .catch(error=>{
                console.log(error);
            })
    }

    /////////////////////////////////// FETCH LANES
    const fetchLanes = async () => {
        // setData({lanes: []});
        await fetch(URL + `api/projects/${projID}/lists/`,
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
                const filteredLanes = resp.results.filter((item)=>{ return !item.is_archived })
                console.log("filtered : ", filteredLanes)
                let laneData = [];
                let laneToIDData = {}
                filteredLanes.forEach((item, index) => {
                    console.log('lane' + item.id.toString())
                    laneToIDData[item.name] = item.id
                    laneData.push({id:item.name, title:item.name, cards: []})
                })
                fetchCards(laneData)
                setLaneToID(laneToIDData)
            })
            .catch(error=>{
                console.log(error);
            })
    }

    
    const updatePaper = (paper_id, list_id) => {
        console.log("Mappings : ", laneToID, list_id)
        fetch(URL + `api/projects/${projID}/papers/${paper_id}/`, {
            method: 'PUT',
            credentials: "same-origin",
            headers: {
                'Authorization': `Token ${getStorageToken()}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
                list_id: laneToID[list_id]
            })
        })
        .catch(error=>{
            console.log(error);
        })
    }


    useEffect(() => {
        if(projID != null) fetchLanes()
    }, [projID])
    
    const handleModalClose = () => {
        setOpenModal(false);
    }

    const shouldReceiveNewData = nextData => {
        console.log('Board has changed')
        // setData({lanes: [...data.lanes, nextData]})
        console.log(nextData)
      }

    const handleCardDelete = (cardId, laneId) => {
        console.log(`Card: ${cardId} deleted from lane: ${laneId}`)
    }

    const handleCardAdd = (card, laneId) => {
        console.log(`New card added to lane ${laneId}`)
        console.log(card)
    }

    const handleCardClick = (cardId, metadata, laneId) => {

        console.log(cardId, metadata)
        setModalData({
            pp_id: cardId,
            paper_id: metadata.paper_id,
            title: metadata.title
        })
        setOpenModal(true);
        console.log(`Card: ${cardId} clicked in lane: ${laneId}`)
    }

    const handleCardMoveLane = (fromLaneId, toLaneId, cardId, index) => {
        updatePaper(cardId, toLaneId)
        console.log(`Card: ${cardId} moved from lane: ${fromLaneId} to lane: ${toLaneId}`)
    }

    const components = {Card: KBCard}

    return (
        <React.Fragment>
            {
                data.lanes.length > 0 &&
                <Board 
                    components={components}
                    data={data} 
                    style={boardStyle}
                    laneStyle={laneStyle}
                    cardStyle={cardStyle}
                    draggable
                    // canAddLane
                    // cardDraggable
                    // laneDraggable
                    // editable
                    // collapsibleLanes
                    // hideCardDeleteIcon
                    // editLaneTitle
                    onDataChange={shouldReceiveNewData}
                    onCardDelete={handleCardDelete}
                    onCardMoveAcrossLanes={handleCardMoveLane}
                    onCardAdd={handleCardAdd}
                    onCardClick={handleCardClick}
                    onLaneUpdate={ (laneId, data) => alert(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                    onLaneAdd={t => alert('You added a line with title ' + t.title)}
                    // handleDragStart={()=>{}}
                    // handleDragEnd={()=>{}}
                    // handleLaneDragStart={()=>{}}
                    // handleLaneDragEnd={()=>{}}
                />
            }

            { openModal && <PaperModal data={modalData} isOpen={true} handleClose={handleModalClose}/> }
        </React.Fragment>
    )
}