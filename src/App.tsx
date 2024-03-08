import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Chat from './components/chat/Chat'
import TopNav from './components/navigation/topNav/TopNav'
import Profile from './components/profile/Profile'

function App() {

  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
