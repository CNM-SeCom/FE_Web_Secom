import { useEffect, useState } from 'react'
import './VerifyOTP.scss'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

interface infoSignup {
    dob: string,
    email: string,
    flag: number,
    gender: string,
    name: string,
    pass: string,
    phone: string,
}

enum Display {
    NONE = 'none',
    BLOCK = 'block',
}

const VerifyOTP = () => {
    const [block, setBlock] = useState<Display>(Display.NONE)
    const [otp, setOtp] = useState<string | number>('')
    const [infoSignup, setInfoSignup] = useState<infoSignup>({
        dob: '',
        email: '',
        flag: 0,
        gender: '',
        name: '',
        pass: '',
        phone: '',
    })
    const [email1, setEmail1] = useState<string>('')
    const { state } = useLocation()
    const IP_BACKEND = 'https://se-com-be.onrender.com'

    const navigate = useNavigate()
    // const dispatch = useAppDispatch()

    const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        console.log(infoSignup)
        console.log(email1)

        await axios.post(`${IP_BACKEND}/verifyOTP`, {
            email: email1,
            otp: otp,
        })
        .then(async () => {
            const genderr: number = parseInt(infoSignup.gender)

            if(state.flag == 1) {
                await axios.post(`${IP_BACKEND}/create`, {
                    phone: infoSignup.phone,
                    name: infoSignup.name,
                    gender: genderr,
                    pass: infoSignup.pass,
                    email: infoSignup.email,
                    dob: infoSignup.dob,
                })
                .then(() => {
                    console.log('Sign up successfully')
                })
                .catch(() => {
                    console.log('Sign up fail')
                })
                navigate('/welcome')
            }
            else if(state.flag == 2 || state.flag == 3) {
                navigate('/change-password', { state: { phone: state.phone } })
            }
        })
        .catch(() => {
            setBlock(Display.BLOCK)
            console.log('Error when verify otp')
        })
    }

    useEffect(() => {
        if(state.flag == 1) {
            setInfoSignup(state)
            setEmail1(state.email)
        }
        else if(state.flag == 2) {
            setEmail1(state.emaill)
        }
        else if(state.flag == 3) {
            setEmail1(state.email)
        }
    }, [])

    return (
        <div className='verifyOTP-wrapper'>
            <div className="form">
                <h2 style={{color:'black'}}>Xác nhận OTP</h2>
                <i style={{color:'black'}}>Hãy nhập mã OTP đã được gửi tới email của bạn</i>
                <label>
                    <span style={{color:'black'}}>OTP</span>
                    <input style={{color:'black'}} type="number" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </label>
                <p className='wrong-info-txt' style={{display: `${block}`}}>Sai OTP</p>
                <button type="button" className="submit" onClick={(e) => handleVerifyOTP(e)}>Xác nhận</button>
            </div>
        </div>
  )
}

export default VerifyOTP
