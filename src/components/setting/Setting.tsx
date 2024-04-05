import './Setting.scss'
import { useAppSelector } from "../../redux/Store";
import { useNavigate, useParams } from 'react-router-dom'
import { UserInterface } from '../../interface/Interface'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import axios from 'axios';

const Setting = () => {
  const [avatar, setAvatar] = useState<string>('')

  const navigate = useNavigate()
  const isLogin: boolean = useAppSelector((state) => state.login.isLogin)
  const user: UserInterface = useAppSelector((state) => state.user.userInfo)
  const params = useParams()
  const { idUser } = params

  // console.log(user, idUser)

  // useEffect(() => {
  //   if(!isLogin) {
  //     navigate('/welcome')
  //   }
  // }, [])

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append(file) 
    
    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const formData = pickFile()

    console.log(formData)

    await axios.post('http://localhost:3000/uploadAvatar', { file: formData }, { headers: { "Content-Type": "multipart/form-data"}})
    .then(() => {
      console.log('Change avatar successfully')
      navigate('/profile', { state: { avatar: avatar } })
    })
    .catch(() => {
      console.log('Change avatar fail')
    })
  }

  return (
    <form encType='multipart/form-data'>
      <div className='setting'>
          <text className='title'>Chỉnh sửa trang cá nhân</text>
          <div className='image'>
            <text>Ảnh đại diện</text>
            <input type="file" name="avatar" id="avatar" accept="image/*" onChange={(e) => pickFile(e)} />
          </div>
          <div className='cover'>
            <text>Ảnh Bìa</text>
            <input type="file" name="cover" id="cover" accept="image/*" />
          </div>
          <div className='info'>
            <text className='infoTitle'>Chỉnh sửa phần giới thiệu</text>
            <div className='ten'>
              <text>Tên</text>
              <input className='inpTen' type='text' value={user.name} />
            </div>
            <div className='ten'>
              <text>Số điện thoại</text>
              <input className='inpTen' type='text' value={user.phone} />
            </div>
            <div className='ten'>
              <text>Email</text>
              <input className='inpTen' type='text' value={user.email} />
            </div>
            <div className='ten'>
              <text>Giới tính</text>
              <input className='inpTen' type='text' placeholder={user.gender ? "Nam" :"Nữ"}></input>
            </div>
            <div className='ten'>
              <text>Địa chỉ</text>
              <input className='inpTen' type='text' placeholder={user.address}></input>
            </div>
            <Button className='btnCapNhat' onClick={(e) => handleSubmit(e)}><text>Cập nhật thông tin</text></Button>
          </div>
      </div>
    </form>
  )
}

export default Setting
