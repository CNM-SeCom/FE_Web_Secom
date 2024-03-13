import { useState } from 'react';
import './Welcome.scss'

const Welcome = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
            <div className="form sign-in">
                <h2>Welcome</h2>
                <label>
                    <span>Số điện thoại</span>
                    <input type="text" />
                </label>
                <label>
                    <span>Mật khẩu</span>
                    <input type="password" />
                </label>
                <p className="forgot-pass">Quên mật khẩu?</p>
                <button type="button" className="submit">Đăng nhập</button>
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
