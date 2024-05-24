import './addFriend.scss'
import { UserInterface } from '../../interface/Interface'
import axios from 'axios'
import { useAppSelector } from '../../redux/Store'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const AddFriend = (list : [{}]) => {

  const navigate = useNavigate()
  interface Props {
    list: { avatarFromUser: string, nameFromUser: string }[];
  }

  const AddFriend = ({ list }: Props) => {
    return (
      <>  
          {list.map((item) => (
              <div className={'conversation-wrapper'}>
                  <img src={item.avatarFromUser} alt='avatar-user' />
                  <h4>{item.nameFromUser}</h4> 
                  <button>+</button>
              </div>
          ))}
      </>
    )
  }
}

export default AddFriend
