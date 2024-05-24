import { useState } from 'react'
import './FormPhone.scss'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const FormPhone = () => {
    const [phone, setPhone] = useState<string>('')
    
    const navigate = useNavigate()
    const IP_BACKEND = 'https://se-com-be.onrender.com'
    enum Display {
        NONE = 'none',
        BLOCK = 'block',
    }
    const [block, setBlock] = useState<Display>(Display.NONE)
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        
        await axios.post(`${IP_BACKEND}/findEmailByPhone`, { phone: phone })
        .then(async(res) => {
            await axios.post(`${IP_BACKEND}/sendOTP`, { email: res.data.data })
            .then(() => {
                navigate('/verify-otp', { state: { phone: phone , email: res.data.data, flag: 3 } })
            })
            .catch(() => {
                console.log('Error when send OTP')
            })
        })
        .catch(() => {
            setBlock(Display.BLOCK)
            console.log('Error when find email by phone')
        })

    }

    return (
        <div className="form-phone">
        <div className="form">
            <i  style={{color:'black'}}>Hãy nhập số điện thoại của bạn</i>
            <label>
                <input  style={{color:'black'}} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <p className='wrong-info-txt' style={{display: `${block}`}}>Không tìm thấy tài khoản tương ứng</p>
            <button type="button" className="submit" onClick={(e) => {handleSubmit(e)}}>Xác nhận</button>
        </div>
        </div>
    )
}

export default FormPhone
