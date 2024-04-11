import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Home from './components/home/Home'
import Chat from './components/chat/Chat'
import Profile from './components/profile/Profile'
import Welcome from './components/welcome/Welcome'
import Navigation from './components/navigation/Navigation'
import SettingProfile from './components/settingProfile/SettingProfile';
import VerifyOTP from './components/verifyOTP/VerifyOTP'
import ChangePassword from './components/forgotPassword/changePassword/ChangePassword'
import FormEmail from './components/forgotPassword/formEmail/FormEmail'
import FormPhone from './components/forgotPassword/formPhone/FormPhone'

function App() {

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/settingProfile' element={<SettingProfile/>} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/form-email' element={<FormEmail />} />
        <Route path='/form-phone' element={<FormPhone />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='*' element={<Navigate to="/welcome" />} />
      </Routes>
    </Router>
  )
}

export default App
