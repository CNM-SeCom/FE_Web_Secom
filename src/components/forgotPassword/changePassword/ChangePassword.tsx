import { useState } from 'react'
import './ChangePassword.scss'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'


const ChangePassword = () => {
    const [password, setPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [flag, setFlag] = useState<boolean>(false)
    const IP_BACKEND = 'https://se-com-be.onrender.com'

    const navigate = useNavigate()

    const { state } = useLocation()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if(password === newPassword) {
            await axios.post(`${IP_BACKEND}/forgotPassword`, {
                phone: state.phone,
                newPass: newPassword,
            }).then(() => {
                console.log('Change password successfully')
                navigate('/welcome')
            })
            .catch(() => {
                console.log('Error when change password')
            })
        }
        else {
            setFlag(true)
        }
    }   

    return (
        <div className="forgot-password-wrapper">
            <div className="form">
                <h2  style={{color:'black'}}>Quên mật khẩu</h2>
                <label>
                    <span style={{color:'black'}}>Mật khẩu mới</span>
                    <input style={{color:'black'}} type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </label>
                <label>
                    <span style={{color:'black'}}>Nhập lại mật khẩu mới</span>
                    <input style={{color:'black'}} type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
                </label>
                <p className='wrong-info-txt' style={{display: `${flag ? 'block' : 'none'}`}}>Vui lòng nhập đúng thông tin!</p>
                <button type="button" className="submit" onClick={(e) => handleSubmit(e)}>Xác nhận</button>
            </div>
        </div>
    )
}

export default ChangePassword
