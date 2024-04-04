import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Chat from './components/chat/Chat'
import Profile from './components/profile/Profile'
import Welcome from './components/welcome/Welcome'
import Navigation from './components/navigation/Navigation'
import VerifyOTP from './components/verifyOTP/VerifyOTP'
import ChangePassword from './components/forgotPassword/changePassword/ChangePassword'
import FormEmail from './components/forgotPassword/formEmail/FormEmail'

function App() {

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile/:idUser' element={<Profile />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/form-email' element={<FormEmail />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        {/* <Route path='/setting' element={<Setting />} /> */}
      </Routes>
    </Router>
  )
}

export default App
