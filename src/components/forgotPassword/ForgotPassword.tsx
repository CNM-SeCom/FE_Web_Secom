import { useEffect, useState } from 'react'
import { useAppSelector } from '../../redux/Store'
import './ForgotPassword.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [phone1, setPhone1] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [flag, setFlag] = useState<boolean>(false)

    const phone2: string | null = useAppSelector((state) => state.phone.phone)
    const navigate = useNavigate()

    useEffect(() => {
        if(phone2 != null) {
            setPhone1(phone2)
        }
    })

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if(password === newPassword) {
            console.log(phone1, newPassword)

            await axios.post('http://localhost:3000/changePassword', {
                phone: phone1,
                newPass: newPassword,
            }).then(() => {
                navigate('/welcome')
            })
            .catch(() => {
                // setFlag(true)
                console.log(777)
            })
        }
        else {
            setFlag(true)
        }
    }   

    return (
        <div className="forgot-password-wrapper">
            <div className="form">
                <h2>Quên mật khẩu</h2>
                <label>
                    <span>Số điện thoại</span>
                    <input type="text" value={`${phone2 !== null ? phone2 : phone1}`} 
                            onChange={(e) => {setPhone1(e.target.value)}} 
                    />
                </label>
                <label>
                    <span>Mật khẩu mới</span>
                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </label>
                <label>
                    <span>Nhập lại mật khẩu mới</span>
                    <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
                </label>
                <p className='wrong-info-txt' style={{display: `${flag ? 'block' : 'none'}`}}>Vui lòng nhập đúng thông tin!</p>
                <button type="button" className="submit" onClick={(e) => handleSubmit(e)}>Xác nhận</button>
            </div>
        </div>
    )
}

export default ForgotPassword
