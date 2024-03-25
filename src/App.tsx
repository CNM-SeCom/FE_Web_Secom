import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Chat from './components/chat/Chat'
import Profile from './components/profile/Profile'
import Welcome from './components/welcome/Welcome'

function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path='/home' element={<Home />} /> */}
        {/* <Route path='/chat' element={<Chat />} /> */}
        <Route path='/profile' element={<Profile />} />
        {/* <Route path='/welcome' element={<Welcome />} /> */}
      </Routes>
    </Router>
  )
}

export default App
