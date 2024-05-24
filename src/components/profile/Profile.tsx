import './Profile.scss'
import { useEffect} from 'react'
import { useNavigate} from 'react-router-dom'
import { useAppSelector } from '../../redux/Store'
import { UserInterface } from '../../interface/Interface'


const Profile = () => {

  const navigate = useNavigate()
  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)

  useEffect(() => {
    if(!isLogin) {
      navigate('/welcome')
    }
  }, [])
  useEffect(() => {

  } , [user])

 

  return (
      <div className="profile">
          <div className="profileRightTop">
            <div className="profileCover">
              <img className="profileCoverImg"src={user.coverImage}alt=""/>
              <button className='updateCoverImg'>Chỉnh sửa ảnh bìa</button>
              <img className="profileUserImg" src={user.avatar} alt="" />
              <button className='updateAvatar'>U</button>
              <div className="profileInfo">
                <h4 className="profileInfoName">{user.name}</h4>
                <span className="profileInfoDesc">{user.listFriend.length} bạn bè</span>
                
              </div>

            </div>
          </div>
          <div className="profileRightBottom">
            <div className='userInfo'>
              <h4>Giới thiệu</h4>
              <button className='themtieusu'>Thêm tiểu sử</button>
              <button className='themtieusu' onClick={() => navigate('/settingprofile')}>Chỉnh sửa chi tiết</button>
            </div>
            <div className='userFeed'>
                <div className='subUserFeed1'>
                    <div className='subUserFeed1top'>
                    <img className="subUserFeed1Img" src={user.avatar} alt=""/>
                    <input className='bandangnghigi' placeholder='Bạn đang nghĩ gì?'/>
                    </div>
                    
                    <div className='subUserFeed11'>
                      <button className='videotructiep'>Video trực tiếp</button>
                      <button className='anhvavideo'>Ảnh và video</button>
                      <button className='sukientrongdoi'>Sự kiện trong đời</button>
                    </div>
                </div>
                <div className='subUserFeed1'>
                    Bản tin
                </div>
            </div>
          </div>
      </div>
  )
}

export default Profile
