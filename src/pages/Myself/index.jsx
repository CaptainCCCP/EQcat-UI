import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import Taro,{Current} from '@tarojs/taro'
import './index.less'
import { AtButton, AtNoticebar, AtFab, AtGrid, AtList, AtListItem,AtAvatar } from 'taro-ui'

export default function Myself() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  // const [Info, setInfo] = useState('')
  // useEffect(()=>{
  //   setInfo(Current.router.params.Info)
  // }, [])

  //const [MyTitle, setMyTile] = useState('')
  // useEffect(()=>{
  //   setMyTile(this.$router.params.MyTitle)
  // }, [])

  return (
    <View className='Myself'>
      {/*<View>{Info}</View>*/}
      <AtAvatar image='https://i.imgur.com/Ulth94a.png'></AtAvatar>

      <AtList>
        <AtListItem
          title='个人账户'
          arrow='right'
        />
        <AtListItem
          title='历史记录'
          arrow='right'
        />
        <AtListItem
          title='帮助中心'
          arrow='right'
        />
        <AtListItem
          title='用户手册'
          arrow='right'
        />
      </AtList>

      <AtButton type='primary' >退出登录</AtButton>
    </View>
    
  )
}
