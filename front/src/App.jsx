import { useState } from 'react'
import './App.css'
import Groups from './components/Groups'
import Chat from './components/Chat'

function App() {

  return (
    <div className='container'>
      <Groups/>
      <Chat/>

    </div>
  )
}

export default App
