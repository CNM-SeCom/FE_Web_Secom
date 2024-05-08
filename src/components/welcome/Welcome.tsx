import { useState } from 'react';
import './Welcome.scss'
import { changeLoginState } from '../../redux/LoginSlice';
import { useAppDispatch } from '../../redux/Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../redux/UserSlice';
import { setToken, setStringeeToken } from '../../redux/TokenSlice';
import { UserInterface } from '../../interface/Interface';
import { setPhone } from '../../redux/PhoneSlice';

enum Display {
    NONE = 'none',
    BLOCK = 'block',
}

const Welcome = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [phone1, setPhone1] = useState<string>('')
    const [phone2, setPhone2] = useState<string>('')
    const [password1, setPassword1] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [password3, setPassword3] = useState<string>('')
    const [block1, setBlock1] = useState<Display>(Display.NONE)
    const [block2, setBlock2] = useState<Display>(Display.NONE)
    const [block3, setBlock3] = useState<Display>(Display.NONE)
    const [gender, setGender] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [user1, setUser1] = useState<UserInterface>()
    const [count, setCount] = useState<number>(0)
    const [email, setEmail] = useState<string>('')

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    }

    const dispatch = useAppDispatch()
    // const isVerify: boolean = useAppSelector((state) => state.otp.isVerify)
    const navigate = useNavigate()

    const updateToken = async (refreshToken: string, idUser: string) => {
        setTimeout( async () => {
        await axios.post('http://localhost:3000/updateAccessToken', {
            refreshToken: refreshToken,
            idUser: idUser,
        }, {validateStatus: () => {
            return true
        }})
        .then((res) => {
            dispatch(setToken(res.data))
            if(user1 !== null) {
                updateToken(res.data.refreshToken, idUser)
                // console.log(111)
            }
        })
        }, 540000)
    }

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if(count < 3) {
            await axios.post('http://localhost:3000/login', {
                    phone: phone1,
                    pass: password1,
                },
            )
            .then((res) => {
                dispatch(setUser(res.data.user))
                setUser1(res.data.user)
                // console.log(user)
                dispatch(setToken(res.data.token))
                dispatch(changeLoginState(true))
                // console.log(res.data.user)
                setBlock1(Display.NONE)
                 axios.post('http://localhost:3000/getCallAccessToken', {
                    userId: res.data.user.idUser,
                }).then((res) => {
                    dispatch(setStringeeToken(res.data.data))
                    console.log("+++++++++++++++++++")
                    console.log(res.data.data)
                })
                navigate('/chat')
                // console.log(res.data.token.refreshToken, '-', res.data.user.idUser)
                updateToken(res.data.token.refreshToken, res.data.user.idUser)
            })
            .catch(() => {
                dispatch(setPhone(phone1))
                setBlock1(Display.BLOCK)
                setCount(count + 1)
                console.log('Error when log in')
            })
        }
        else {
            await axios.post('http://localhost:3000/findEmailByPhone', {
                phone: phone1,
            })
            .then((res) => {
                // console.log(res.data.data)
                navigate('/form-email', { state: { email: res.data.data, phone: phone1, } })
            })
            .catch(() => {
                console.log('Error when find email by phone')
            })
        }
    }

    const handleSignup = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        await axios.post('http://localhost:3000/checkPhoneExist', { phone: phone2 })
        .then(async () => {
            if(password2 != password3) {
                setBlock2(Display.BLOCK)
            }
            else {
                await axios.post('http://localhost:3000/sendOTP', {
                    email: email,
                })
                .then(() => {
                    navigate('/verify-otp', { state: { 
                        phone: phone2,
                        name: name,
                        gender: gender,
                        pass: password2,
                        email: email,
                        dob: '', 
                        flag: 1,
                    }})
                })
                .catch(() => {
                    console.log('Error when send OTP')
                })
            }
        })
        .catch(() => {
            setBlock3(Display.BLOCK)
            console.log(666)
        })

    }

    return (
        <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
            <div className="form sign-in">
                <h2>Welcome</h2>
                <label>
                    <span>Số điện thoại</span>
                    <input type="text" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
                </label>
                <label>
                    <span>Mật khẩu</span>
                    <input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
                </label>
                <div className="wrong-info-wrapper">
                    <p className='wrong-info-txt' style={{display: `${block1}`}}>Vui lòng nhập đúng thông tin!</p>
                    <p className="forgot-pass" onClick={() => navigate('/form-phone')}>Quên mật khẩu?</p>
                </div>
                <button type="button" className="submit" onClick={(e) => handleLogin(e)}>Đăng nhập</button>
            </div>
            <div className="sub-cont">
                <div className="img">
                    <div className="img__text m--up">
                        <h3>Bạn chưa có tài khoản? Vui lòng Đăng ký!</h3>
                    </div>
                    <div className="img__text m--in">
                        <h3>Nếu bạn đã có tài khoản, hãy đăng nhập.</h3>
                    </div>
                    <div className="img__btn" onClick={() => toggleSignUp()}>
                        <span className="m--up">Đăng ký</span>
                        <span className="m--in">Đăng nhập</span>
                    </div>
                </div>
                <div className="form sign-up">
                    <h2>Tạo tài khoản mới</h2>
                    <label>
                        <span>Tên</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <span>Số điện thoại</span>
                        <input type="text" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
                    </label>
                    <label>
                        <span>Mật khẩu</span>
                        <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    </label>
                    <label>
                        <span>Nhập lại mật khẩu</span>
                        <input type="password" value={password3} onChange={(e) => setPassword3(e.target.value)}/>
                    </label>
                    <label>
                        <span>Giới tính</span>
                        <select name='gender' onChange={(e) => setGender(e.target.value)}>
                            <option value="0">Nam</option>
                            <option value="1">Nữ</option>
                            {/* <option value="other">Khác</option> */}
                        </select>
                    </label>
                    <p className='wrong-info-txt' style={{display: `${block2}`}}>Xác nhận mật khẩu không đúng!</p>
                    <p className='wrong-info-txt' style={{display: `${block3}`}}>Tài khoản đã tồn tại!</p>
                    <button type="button" className="submit" onClick={(e) => handleSignup(e)}>Đăng ký</button>
                </div>
            </div>
        </div>
    )
}

export default Welcome
