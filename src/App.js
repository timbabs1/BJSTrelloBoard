import React, { Component } from 'react';
import Board from 'react-trello'
//import data from './data.js';
import data from './data2.json';
import logo from './logo.svg';
import './App.css';

const handleDragStart = (cardId, laneId) => {
  console.log('drag started')
  console.log(`cardId: ${cardId}`)
  console.log(`laneId: ${laneId}`)
}

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log('drag ended')
  console.log(`cardId: ${cardId}`)
  console.log(`sourceLaneId: ${sourceLaneId}`)
  console.log(`targetLaneId: ${targetLaneId}`)
}


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      boardData: { lanes: [] }

    }
    this.ls = window.localStorage
    this.myValue = { lanes: []} 
    for (let i = 0;i<this.ls.length;i++) {
      this.myValue.lanes[i] = JSON.parse(this.ls.getItem('key' + i))
    }
    }
    setEventBus = (eventBus) => {
      this.setState({ eventBus })
    }
    async componentWillMount() {
      const response = await this.getBoard()
      console.log(response)
      console.log(this.state.boardData.lanes)

      if (!this.ls) {
        this.setState({ boardData: response })
        for (let i=0; i<this.state.boardData.lanes.length; i++){
          console.log(this.state.boardData.lanes[i])
          this.ls.setItem('key' + i, JSON.stringify(this.state.boardData.lanes[i]))
        }
        console.log(this.state.boardData.lanes)
        console.log("Default was chosen")
      }
      else {
        this.setState({ boardData: this.myValue})
        // for (let i=0; i<this.myValue.length; i++) {
        //   this.state.boardData.lanes[i] = this.myValue.lanes[i]
        // }
        console.log(this.state.boardData.lanes)
        console.log(this.myValue.lanes)
        console.log(this.myValue)
        console.log(response)
        console.log("My value was used")
      }
    }
    
    getBoard() {
      return new Promise((resolve) => {
        resolve(data)
      })
    }
    completeCard = () => {
      this.state.eventBus.publish({
        type: 'ADD_CARD',
        laneId: 'COMPLETED',
        card: {
          id: 'Milk',
          title: 'Buy Milk',
          label: '15 mins',
          description: 'Use Headspace app',
        },
      })
      this.state.eventBus.publish({
        type: 'REMOVE_CARD',
        laneId: 'PLANNED',
        cardId: 'Milk',
      })
      
    }
  
    addCard = () => {
      this.state.eventBus.publish({
        type: 'ADD_CARD',
        laneId: 'BLOCKED',
        card: {
          id: 'Ec2Error',
          title: 'EC2 Instance Down',
          label: '30 mins',
          description: 'Main EC2 instance down',
        },
      })
    }
  
    shouldReceiveNewData = (nextData) => {
      console.log('New card has been added')
      console.log(nextData)
    }
  
    handleCardAdd = (card, laneId) => {
      console.log(`New card added to lane ${laneId}`)
      console.dir(card)
      if (laneId === 'PLANNED'){
        let a = this.state.boardData.lanes[0].cards.length + 1
        this.state.boardData.lanes[0].cards[a-1] = card
        this.ls.setItem('key' + 0, JSON.stringify(this.state.boardData.lanes[0]))
        console.log(this.myValue.lanes)
        console.log(this.state.boardData.lanes)
      }
      
      console.log(this.state.eventbus)

    }
  

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h3>React Trello Demo</h3>
        </div>
        <div className="App-intro">
          <button onClick={this.completeCard} style={{ margin: 5 }}>
            Complete Buy Milk
          </button>
          <button onClick={this.addCard} style={{ margin: 5 }}>
            Add Blocked
          </button>
          <Board
            editable
            onCardAdd={this.handleCardAdd}
            data={this.state.boardData}
            draggable
            onDataChange={this.shouldReceiveNewData}
            eventBusHandle={this.setEventBus}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          />
        </div>
      </div>
    )
  }
}
