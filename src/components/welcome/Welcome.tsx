import { useState } from 'react';
import './Welcome.scss'
import { changeLoginState } from '../../redux/LoginSlice';
import { useAppDispatch } from '../../redux/Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../redux/UserSlice';
import { setToken, setStringeeToken, setAccessToken } from '../../redux/TokenSlice';
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
    const [count, setCount] = useState<number>(1)
    const [email, setEmail] = useState<string>('')
    const [checkEmail, setCheckEmail] = useState<boolean>(true)
    const [checkPhone, setCheckPhone] = useState<boolean>(true) 
    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    }

    const dispatch = useAppDispatch()
    const IP_BACKEND = 'https://se-com-be.onrender.com'
    // const isVerify: boolean = useAppSelector((state) => state.otp.isVerify)
    const navigate = useNavigate()

    const updateToken = async (refreshToken: string, idUser: string) => {
        setTimeout( async () => {
        await axios.post(`${IP_BACKEND}/updateAccessToken`, {
            refreshToken: refreshToken,
            idUser: idUser,
        }, {validateStatus: () => {
            return true
        }})
        .then((res) => {
            dispatch(setToken(res.data))
            dispatch(setAccessToken(res.data.accessToken))
            if(user1 !== null) {
                // updateToken(res.data.refreshToken, idUser)
                // console.log(111)
            }
        })
        }, 540000)
    }

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if(count < 3) {
            await axios.post(`${IP_BACKEND}/login`, {
                    phone: phone1,
                    pass: password1,
                },
            )
            .then((res) => {
                dispatch(setUser(res.data.user))
                setUser1(res.data.user)
                // console.log(user)
                dispatch(setToken(res.data.token))
                dispatch(setAccessToken(res.data.token.accessToken))
                dispatch(changeLoginState(true))
                // console.log(res.data.user)
                setBlock1(Display.NONE)
                 axios.post(`${IP_BACKEND}/getCallAccessToken`, {
                    userId: res.data.user.idUser,
                }).then((res) => {
                    dispatch(setStringeeToken(res.data.data))
                    localStorage.setItem('stringeeToken', res.data.data)
                    
                })
                navigate('/chat')
                // console.log(res.data.token.refreshToken, '-', res.data.user.idUser)
                // updateToken(res.data.token.refreshToken, res.data.user.idUser)
            })
            .catch(() => {
                dispatch(setPhone(phone1))
                setBlock1(Display.BLOCK)
                setCount(count + 1)
                console.log('Error when log in')
            })
        }
        else {
            await axios.post(`${IP_BACKEND}/findEmailByPhone`, {
                phone: phone1,
            })
            .then((res) => {
                // console.log(res.data.data)
                navigate('/form-email', { state: { email: res.data.data, phone: phone1, } })
            })
            .catch(() => {
                navigate('/form-email')
                console.log('Error when find email by phone')
            })
        }
    }

    const handleSignup = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

       if(!checkEmail||!checkPhone||name === '' || email === '' || phone2 === '' || password2 === '' || password3 === '') {
            alert('Vui lòng điền đầy đủ thông tin!')
        }
        else {
            await axios.post(`${IP_BACKEND}/checkPhoneExist`, { phone: phone2 })
            .then(async () => {
                if(password2 != password3) {
                    setBlock2(Display.BLOCK)
                }
                else {
                    await axios.post(`${IP_BACKEND}/sendOTP`, {
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
      
    }

    return (
        <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
            <div className="form sign-in">
                <h2 style={{color:'black'}}>Welcome</h2>
                <label>
                    <span style={{color:'black'}}>Số điện thoại</span>
                    <input style={{color:'black'}} type="text" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
                </label>
                <label>
                    <span style={{color:'black'}}>Mật khẩu</span>
                    <input style={{color:'black'}} type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} onKeyPress={(e) => {(e.key === 'Enter' ? handleLogin(e) : null)}} />
                </label>
                <div className="wrong-info-wrapper">
                    <p className='wrong-info-txt' style={{display: `${block1}`}}>Thông tin đăng nhập không chính xác, bạn còn {4-count} lần thử</p>
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
                    <h2  style={{color:'black'}}>Tạo tài khoản mới</h2>
                    <label>
                        <span>Tên</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => {
                            //regex email
                            const re = /\S+@\S+\.\S+/;
                            if(re.test(e.target.value)) {
                                setCheckEmail(true)
                            }
                            else {
                                setCheckEmail(false)
                            }
                            setEmail(e.target.value)}} placeholder='abc@xyz.com'/>
                        <span style={{display: `${checkEmail ? 'none' : 'block'}`, color:"red"}}>Nhập đúng định dạng email</span>
                    </label>
                    <label>
                        <span>Số điện thoại</span>
                        <input type="text" value={phone2} onChange={(e) =>{
                            //regex phone có 10 số
                            const re = /^[0-9]{10}$/;
                            if(re.test(e.target.value)) {
                                setCheckPhone(true)
                            }
                            else {
                                setCheckPhone(false)
                            }

                            setPhone2(e.target.value)}} placeholder='0123456789'/>
                        <span style={{display: `${checkPhone ? 'none' : 'block'}`, color:"red"}}>Nhập đúng định dạng số điện thoại</span>
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
