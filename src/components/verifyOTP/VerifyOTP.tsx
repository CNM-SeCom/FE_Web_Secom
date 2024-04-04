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

const VerifyOTP = () => {
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

    const navigate = useNavigate()
    // const dispatch = useAppDispatch()

    const handleVerifyOTP = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        console.log(infoSignup)
        console.log(email1)

        await axios.post('http://localhost:3000/verifyOTP', {
            email: email1,
            otp: otp,
        })
        .then(async () => {
            const genderr: number = parseInt(infoSignup.gender)

            if(state.flag == 1) {
                await axios.post('http://localhost:3000/create', {
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
            else if(state.flag == 2) {
                navigate('/change-password', { state: { phone: state.phone } })
            }
        })
        .catch(() => {
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
    }, [])

    return (
        <div className='verifyOTP-wrapper'>
            <div className="form">
                <h2>Xác nhận OTP</h2>
                <i>Hãy nhập mã OTP đã được gửi tới email của bạn</i>
                <label>
                    <span>OTP</span>
                    <input type="number" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </label>
                <button type="button" className="submit" onClick={(e) => handleVerifyOTP(e)}>Xác nhận</button>
            </div>
        </div>
  )
}

export default VerifyOTP
