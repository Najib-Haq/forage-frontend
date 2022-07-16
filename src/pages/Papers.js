import React, { useState, useEffect } from "react";
import Board from 'react-trello'
import '../styles/Kanban.css' // for some teason this doesnt work when refreshing? :/ 

import PaperModal from '../components/PaperModal'
import KBCard from '../components/KBCard'
import { getStorageToken } from "../context/Auth";
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


function populateCards(data) {
    let number = data.count
    let lanes = []
    let all_cards = []
    let status = ['Review', 'In Progress'] // TODO: get from backend

    data.results.forEach((item, index) => {
        // console.log(index)
        let card_lane = status[index%2]
        if(!lanes.includes(card_lane)) {
            lanes.push(card_lane)
            all_cards[index%2] = {
                id: card_lane,
                title: card_lane,
                cards: [],
                // individual lane styles
                // style: {backgroundColor: '#f3f3f3', borderRadius: '15px', boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.75)'}, // individual lane style
                // cardStyle: { borderRadius: '15px' } // card style
            }
        }

        all_cards[index%2].cards.push({
            id: item.id.toString(), // they expect string in id
            title: item.name, 
            description: '', 
            draggable: true,
            label: item.id.toString(),
            metadata: {'title': item.name},
            // style: { backgroundColor: 'red'} // individual card style
        })
    })

    console.log({lanes: all_cards})
    return {lanes: all_cards}
}

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

    const [data, setData] = useState({lanes: []});
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});

    

    useEffect(() => {
        fetch(URL + 'api/papers/',
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
                setData(populateCards(resp))
            })
            .catch(error=>{
                console.log(error);
            })
    }, [])

    const handleModalClose = () => {
        setOpenModal(false);
    }

    const shouldReceiveNewData = nextData => {
        console.log('Board has changed')
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
                // onDataChange={shouldReceiveNewData}
                onCardDelete={handleCardDelete}
                onCardMoveAcrossLanes={(fromLaneId, toLaneId, cardId, index) => alert("moving")}
                onCardAdd={handleCardAdd}
                onCardClick={handleCardClick}
                onLaneUpdate={ (laneId, data) => alert(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                onLaneAdd={t => alert('You added a line with title ' + t.title)}
                
            />

            <PaperModal data={modalData} isOpen={openModal} handleClose={handleModalClose}/>
        </React.Fragment>
    )
}