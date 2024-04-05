import './Profile.scss'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../redux/Store'
import { UserInterface } from '../../interface/Interface'


const Profile = () => {
  const [avatar, setAvatar] = useState<string>('')

  const navigate = useNavigate()
  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)
  // const params = useParams()
  // const { idUser } = params

  const { state } = useLocation()

  // console.log(user, idUser)

  useEffect(() => {
    // if(!isLogin) {
    //   navigate('/welcome')
    // }
    if(state != null) {
      setAvatar(state.avatar)
    }
    else {
      setAvatar(user.avatar)
    }
  }, [])

  return (
      <div className="profile">
          <div className="profileRightTop">
            <div className="profileCover">
              <img className="profileCoverImg"src={user.coverImage }alt=""/>
              <button className='updateCoverImg'>Chỉnh sửa ảnh bìa</button>
              <img className="profileUserImg" src={avatar} alt="" />
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
              <div className='ttchitiet'>
                <div className='tunghoc'>
                  <p>Từng học tại <p className='chitiet'>Đại học Công Nghiệp thành phố HCM</p></p>
                </div>
                <div className='dahoc'>
                  <p>Đã học tại  <p className='chitiet'>Đại học Công Nghiệp thành phố HCM</p></p>
                </div>
                <div className='dentu'>
                  <p>Đến từ  <p className='chitiet'>Long An</p></p>
                </div>
                <div className='tinhtrang'>
                  <p>Độc thân</p>
                </div>
              </div>
              <button className='themtieusu' onClick={() => navigate('/setting')}>Chỉnh sửa chi tiết</button>
              <button className='themtieusu'>Thêm nội dung đáng chú ý</button>
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
