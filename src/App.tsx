import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Chat from './components/chat/Chat'
import Profile from './components/profile/Profile'
import Welcome from './components/welcome/Welcome'
import Setting from './components/setting/Setting'
import Navigation from './components/navigation/Navigation'

function App() {

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile/:idUser' element={<Profile />} />
        <Route path='/welcome' element={<Welcome />} />
        {/* <Route path='/setting' element={<Setting />} /> */}
      </Routes>
    </Router>
  )
}

export default App
