import React, { useState, useEffect } from "react";
import Board from 'react-trello'
import '../styles/Kanban.css' // for some teason this doesnt work when refreshing? :/ 

import PaperModal from '../components/PaperModal'
import KBCard from '../components/KBCard'
import { getStorageToken } from "../context/Auth";
import { useProjID } from "../context/ProjectID";
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
    const [lanes, setLanes] = useState(2);
    const [data, setData] = useState({lanes: []}); //[{id: 'loading', title: 'loading..', cards: []}]});
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    

    /////////////////////////////////// FETCH LANES
    function fetchLanes() {
        // setData({lanes: []});
        fetch(URL + `api/projects/${projID}/lists/`,
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
                const filteredData = resp.results.filter((item)=>{ return !item.is_archived })
                // console.log("filtered : ", filteredData.length)
                setLanes(filteredData.length);
                filteredData.map((item, index)=>fetchCards(item, index))
            })
            .catch(error=>{
                console.log(error);
            })
    }

    useEffect(() => {
        if(projID != null) fetchLanes()
    }, [projID])
    
    /////////////////////////////////// FETCH CARDS
    function fetchCards(lane, idx) {
        console.log(lane.name);
        fetch(URL + `api/projects/${projID}/lists/${lane.id}/papers`,
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
                
                let newLaneData = {
                    id: lane.id.toString(),
                    title: lane.name.toString(),
                    cards: [],
                }
                
                resp.map((item)=>{
                    newLaneData.cards.push({
                        id: item.id.toString(), // they expect string in id 
                        title: item.name.toString(),
                        description: '', //item.authors,
                        // label: item.doi,
                        // draggable: true,
                        metadata: {
                            title: item.name.toString(),
                        }
                    })
                })

                setData({lanes: [...data.lanes, newLaneData]})
                console.log(data)
                console.log("Compare : ", data.lanes.length, lanes)
            })
            .catch(error=>{
                console.log(error);
            })
    }

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
        setModalData({
            id: cardId,
            name: metadata.title,
        })
        setOpenModal(true);
        console.log(`Card: ${cardId} clicked in lane: ${laneId}`)
    }

    const components = {Card: KBCard}

    return (
        <React.Fragment>
            {
                data.lanes.length >= lanes &&
                <Board 
                    components={components}
                    data={data} 
                    style={boardStyle}
                    laneStyle={laneStyle}
                    cardStyle={cardStyle}
                    draggable={true}
                    editable
                    canAddLanes
                    collapsibleLanes
                    // hideCardDeleteIcon
                    editLaneTitle
                    onDataChange={shouldReceiveNewData}
                    onCardDelete={handleCardDelete}
                    onCardMoveAcrossLanes={(fromLaneId, toLaneId, cardId, index) => alert("moving")}
                    onCardAdd={handleCardAdd}
                    onCardClick={handleCardClick}
                    onLaneUpdate={ (laneId, data) => alert(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                    onLaneAdd={t => alert('You added a line with title ' + t.title)}
                    
                />
            }
            

            <PaperModal data={modalData} isOpen={openModal} handleClose={handleModalClose}/>
        </React.Fragment>
    )
}