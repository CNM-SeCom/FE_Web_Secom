import { useLocation, useNavigate } from 'react-router-dom'
import './FormEmail.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'


const FormEmail = () => {
  const [email, setEmail] = useState<string>('')

  const { state } = useLocation()

  const navigate = useNavigate()
  const IP_BACKEND = 'https://se-com-be.onrender.com'

  useEffect(() => {
    if(state != null) {
      setEmail(state.email)
    }
  }, [])

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    await axios.post(`${IP_BACKEND}/sendOTP`, {
        email: email,
    })
    .then(() => {
      navigate('/verify-otp', { state: { emaill: email, phone: state.phone, flag: 2 } })
    })
    .catch(() => {
      console.log('Send OTP fail')
    })
  }

  return (
    <div className='form-email'>
      <div className="form">
          <i  style={{color:'black'}}>Hãy nhập email của bạn</i>
          <label>
              <input style={{color:'black'}} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="button" className="submit" onClick={(e) => {handleSubmit(e)}}>Xác nhận</button>
      </div>
    </div>
  )
}

export default FormEmail
