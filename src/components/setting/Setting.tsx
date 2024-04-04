import './Setting.scss'
import { useAppSelector } from "../../redux/Store";
import { useNavigate, useParams } from 'react-router-dom'
import { UserInterface } from '../../interface/Interface'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';

const Setting = () => {
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
    <div className='setting'>
        <text className='title'>Chỉnh sửa trang cá nhân</text>
        <div className='image'>
          <text>Ảnh đại diện</text>
          <input type="file" name="avatar" id="avatar" accept="image/*" onChange={(e) => {setAvatar(e.target)}}></input>
        </div>
        <div className='cover'>
          <text>Ảnh Bìa</text>
          <input type="file" name="cover" id="cover" accept="image/*"></input>
        </div>
        <div className='info'>
          <text className='infoTitle'>Chỉnh sửa phần giới thiệu</text>
          <div className='ten'>
            <text>Tên</text>
            <input className='inpTen' type='text' placeholder={user.name}></input>
          </div>
          <div className='ten'>
            <text>Số điện thoại</text>
            <input className='inpTen' type='text' placeholder={user.phone}></input>
          </div>
          <div className='ten'>
            <text>Email</text>
            <input className='inpTen' type='text' placeholder={user.email}></input>
          </div>
          <div className='ten'>
            <text>Giới tính</text>
            <input className='inpTen' type='text' placeholder={user.gender ? "Nam" :"Nữ"}></input>
          </div>
          <div className='ten'>
            <text>Địa chỉ</text>
            <input className='inpTen' type='text' placeholder={user.address}></input>
          </div>
        </div>
        <div className='btnCapNhat'>
          <Button><text>Cập nhật thông tin</text></Button>
        </div>
    </div>
  )
}

export default Setting
