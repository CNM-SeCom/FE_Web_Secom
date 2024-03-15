import { useState } from 'react';
import './Welcome.scss'
import { changeLoginState } from '../../redux/LoginSlice';
import { useAppDispatch } from '../../redux/Store';
import { useNavigate } from 'react-router-dom';

const account = [
    {
        phone: '0916420671',
        password: '123456',
    },
    {
        phone: '0911111111',
        password: '1234567',
    },
    {
        phone: '0912456789',
        password: '12345678',
    },
]

enum Display {
    NONE = 'none',
    BLOCK = 'block',
}

const Welcome = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [block, setBlock] = useState<Display>(Display.NONE)

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    }

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogin = () => {
        account.some((a) => {
            if(a.phone === phone && a.password === password) {
                console.log(111)
                navigate('/chat')
                setBlock(Display.NONE)
                dispatch(changeLoginState(true))
            }
            else {
                setBlock(Display.BLOCK)
            }
        })
    }

    return (
        <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
            <div className="form sign-in">
                <h2>Welcome</h2>
                <label>
                    <span>Số điện thoại</span>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label>
                    <span>Mật khẩu</span>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <div className="wrong-info-wrapper">
                    <p className='wrong-info-txt' style={{display: `${block}`}}>Vui lòng nhập đúng thông tin!</p>
                    <p className="forgot-pass">Quên mật khẩu?</p>
                </div>
                <button type="button" className="submit" onClick={() => handleLogin()}>Đăng nhập</button>
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
                        <span>Số điện thoại</span>
                        <input type="text" />
                    </label>
                    <label>
                        <span>Mật khẩu</span>
                        <input type="password" />
                    </label>
                    <label>
                        <span>Nhập lại mật khẩu</span>
                        <input type="password" />
                    </label>
                    <button type="button" className="submit">Đăng ký</button>
                </div>
            </div>
        </div>
    )
}

export default Welcome
