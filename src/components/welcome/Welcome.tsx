import { useState } from 'react';
import './Welcome.scss'
import { changeLoginState } from '../../redux/LoginSlice';
import { useAppDispatch } from '../../redux/Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

enum Display {
    NONE = 'none',
    BLOCK = 'block',
}

const Welcome = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [phone1, setPhone1] = useState<string>('0399889699')
    const [phone2, setPhone2] = useState<string>('')
    const [password1, setPassword1] = useState<string>('aaaaaaaaA1@')
    const [password2, setPassword2] = useState<string>('')
    const [password3, setPassword3] = useState<string>('')
    const [block1, setBlock1] = useState<Display>(Display.NONE)
    const [block2, setBlock2] = useState<Display>(Display.NONE)
    const [gender, setGender] = useState<string>('')
    const [name, setName] = useState<string>('')

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    }

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        await axios.post('http://localhost:3000/login', {
                phone: phone1,
                pass: password1,
            },
        )
        .then(() => {
            dispatch(changeLoginState(true))
            setBlock1(Display.NONE)
            navigate('/chat')
        })
        .catch((error): void => {
            console.log('Error', error)
            setBlock1(Display.BLOCK)
        })
    }

    const handleSignup = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if(password2 != password3) {
            setBlock2(Display.BLOCK)
        }
        else {
            await axios.post('http://localhost:3000/create', {
                phone: phone2,
                name: name,
                gender: gender,
                pass: password2,
            })
            .then(() => {
                setIsSignUp(false)
            })
            .catch((error): void => {
                console.log('Error: ', error)
            })
        }
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
                    <p className="forgot-pass">Quên mật khẩu?</p>
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
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </label>
                    <p className='wrong-info-txt' style={{display: `${block2}`}}>Xác nhận mật khẩu không đúng!</p>
                    <button type="button" className="submit" onClick={(e) => handleSignup(e)}>Đăng ký</button>
                </div>
            </div>
        </div>
    )
}

export default Welcome
