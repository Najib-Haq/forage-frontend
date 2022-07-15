import React, { useState, useEffect } from "react";
import Board from 'react-trello'
import '../styles/Kanban.css' // for some teason this doesnt work when refreshing? :/ 

import apidata from '../constant.js' // TODO: remove this
import PaperModal from '../components/PaperModal'

const data = {
    lanes: [
      {
        id: 'lane1',
        title: 'Planned Tasks',
        label: '2/2',
        cards: [
          {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: false},
          {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
        ]
      },
      {
        id: 'lane2',
        title: 'Completed',
        label: '0/0',
        cards: []
      }
    ]
}


function populateCards(data) {
    let number = data.count
    let lanes = []
    let all_cards = []

    data.results.forEach(item => {
        if(!lanes.includes(item.status)) {
            lanes.push(item.status)
            all_cards[lanes.indexOf(item.status)] = {
                id: item.status,
                title: item.status,
                cards: [],
                style: {backgroundColor: '#f3f3f3'}, // lane style
                // cardStyle: {height: 'auto', textAlign: 'center'} // card style
            }
        }

        all_cards[lanes.indexOf(item.status)].cards.push({
            id: item.id.toString(), // they expect string in id
            title: item.name, 
            description: "", 
            draggable: true,
            label: '',
            metadata: {'title': item.name}
        })
    })

    return {lanes: all_cards}
}


const boardStyle = {
    'backgroundColor': 'inherit',
    // 'fontFamily': 'sans-serif',
    // 'wordWrap': 'break-word',
    // 'overflowWrap': 'break-word',
}
  
export default function Papers() {

    const data = populateCards(apidata())
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});

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

    return (
        <React.Fragment>
            <Board 
                data={data} 
                style={boardStyle}
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

            {openModal && <PaperModal data={modalData} isOpen={openModal} handleClose={handleModalClose}/>}
        </React.Fragment>
    )
}