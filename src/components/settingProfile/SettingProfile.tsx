import './SettingProfile.scss'
import { useAppSelector } from "../../redux/Store";
import { useLocation, useNavigate} from 'react-router-dom'
import { UserInterface } from '../../interface/Interface'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setNameUser, setAvatarUser, setCoverUser, setUser } from '../../redux/UserSlice';

const Setting = () => {
  const [avatar, setAvatar] = useState(null) 
  const [coverImage, setCoverImage] = useState(null) 
  const [name, setName] = useState<string>('') 
  const navigate = useNavigate()
  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)
  const { state } = useLocation()
  const dispatch = useDispatch();

  //Chuyển avatar: string thành blob
  const avatarBlob = new Blob([avatar], { type: 'text/plain' });
  const coverBlob = new Blob([coverImage], { type: 'text/plain' });

  //Update thông tin trong redux
  const updateNameRedux = () => {
    dispatch(setNameUser(name))
  }
  const updateAvatarRedux = () => {
    dispatch(setAvatarUser(URL.createObjectURL(avatarBlob)))
  }
  const updateCoverImageRedux = () => {
    dispatch(setCoverUser(URL.createObjectURL(coverBlob)))
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upAvatar = e.target.files[0]
    setAvatar(upAvatar);
    console.log(e.target.files[0]);
  }

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upCover = e.target.files[0]
    setCoverImage(upCover);
    console.log(e.target.files[0]);
  }

  const handleName = (e : React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    console.log(e.target.value);
  }

  const handleSubmitAvatar = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault()

    const formData = new FormData();

    formData.append('file', avatar); 
    formData.append('idUser', user.idUser); 

    console.log("FormData", formData.get('file'))
    const IP_BACKEND = 'https://se-com-be.onrender.com'

    await axios.post(`${IP_BACKEND}/uploadAvatarWeb`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(() => {
      console.log('Change avatar successfully')
      updateAvatarRedux()
      navigate('/profile', { state: { avatar: avatar } })
    })
    .catch(() => {
      console.log('Change avatar fail')
    })
  }

  const handleSubmitCover = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault()

    const formData = new FormData();

    formData.append('file', coverImage); 
    formData.append('idUser', user.idUser); 

    console.log("FormData", formData.get('file'))

    await axios.post(`${IP_BACKEND}/uploadCoverImageWeb`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(() => {
      console.log('Change cover image successfully')
      updateCoverImageRedux()
      navigate('/profile', { state: { coverImage: coverImage } })
    })
    .catch(() => {
      console.log('Change cover image fail')
    })
  }

  const handleSubmitName = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        await axios.post(`${IP_BACKEND}/getListUserByName`, {
            name: name,
        }).then(() => {
            console.log('Change name successfully')
            navigate('/profile', { state: { name: name } })
        })
        .catch(() => {
            console.log('Error when change name')
        })
  }    

useEffect(() => {
  if(!isLogin) {
    navigate('/welcome')
  }
  if(state != null) {
    setName(state.name)
  }
  else {
    setName(user.name)
  }
}, [])

  return (
    <form >
      <div className='setting'>
          <p className='title'>Chỉnh sửa trang cá nhân</p>  
          <div className='image'>
            <p>Ảnh đại diện</p>
            <input type="file" name="avatar" id="avatar" accept="image/*" onChange={(e)=>{handleImage(e)}}/>
          </div>
          <div className='cover'>
            <p>Ảnh Bìa</p>
            <input type="file" name="cover" id="cover" accept="image/*" onChange={(e)=>{handleCoverImage(e)}}/>
          </div>
          <div className='info'>
            <p className='infoTitle'>Chỉnh sửa phần giới thiệu</p>
            <div className='ten'>
              <p>Tên</p>
              <input className='inpTen' type='text' value={name} onChange={(e)=>{handleName(e)}}/>
            </div>
            <div className='ten'>
              <p>Số điện thoại</p>
              <input className='inpTen' type='text' value={user.phone} />
            </div>
            <div className='ten'>
              <p>Email</p>
              <input className='inpTen' type='text' value={user.email} />
            </div>
             <div className='ten'>
              <p>Giới tính</p>
              <select className='Gender' defaultValue={user.gender}>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
              </select>
            </div>
           
            {/* <div className='ten'>
              <text>Địa chỉ</text>
              <input className='inpTen' type='text' value={address} onChange={(e)=>{handleAddress(e)}}></input>
            </div> */}
            <Button type='submit' className='btnCapNhat' onClick={(e) => {handleSubmitAvatar(e); handleSubmitName(e); handleSubmitCover(e)}}><text>Cập nhật thông tin</text></Button>
          </div>
      </div>
     </form>
  )
}

export default Setting
