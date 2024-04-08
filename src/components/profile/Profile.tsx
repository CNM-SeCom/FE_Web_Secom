import './Profile.scss'
import avatar from '../../assets/person/7.jpeg'
import pagebackground from '../../assets/3.jpeg'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../redux/Store'
import { UserInterface } from '../../interface/Interface'

const Profile = () => {

  const navigate = useNavigate()
  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)
  const params = useParams()
  const { idUser } = params

  console.log(user, idUser)

  useEffect(() => {
    if(!isLogin) {
      navigate('/welcome')
    }
  }, [])

  return (
    <>
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={pagebackground}
                alt=""
              />
              <img
                className="profileUserImg"
                src={user.avatar}
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.name}</h4>
                {/* <span className="profileInfoDesc">350 bạn bè</span> */}
            </div>
          </div>
          <div className="profileRightBottom">
            <div className='userInfo'>
              <h4>Giới thiệu</h4>
              <button className='themtieusu'>Thêm tiểu sử</button>
              <div className='ttchitiet'>
                <div className='tunghoc'>
                  <text>Từng học tại <text className='chitiet'>Đại học Công Nghiệp thành phố HCM</text></text>
                </div>
                <div className='dahoc'>
                  <text>Đã học tại  <text className='chitiet'>Đại học Công Nghiệp thành phố HCM</text></text>
                </div>
                <div className='dentu'>
                  <text>Đến từ  <text className='chitiet'>Long An</text></text>
                </div>
                <div className='tinhtrang'>
                  <text>Độc thân</text>
                </div>
              </div>
              <button className='themtieusu'>Chỉnh sửa chi tiết</button>
              <button className='themtieusu'>Thêm nội dung đáng chú ý</button>
            </div>
            <div className='userFeed'>
                <div className='subUserFeed1'>
                    <div className='subUserFeed1top'>
                    <img className="subUserFeed1Img" src={avatar} alt=""/>
                    <input className='bandangnghigi' placeholder='Bạn đang nghĩ gì?'/>
                    </div>
                    
                    <div className='subUserFeed11'>
                      <button className='videotructiep'>
                        <text>Video trực tiếp</text>
                      </button>
                      <button className='anhvavideo'>
                        <text>Ảnh và video</text>
                      </button>
                      <button className='sukientrongdoi'>
                        <text>Sự kiện trong đời</text>
                      </button>
                    </div>
                </div>
                <div className='subUserFeed1'>
                    
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
