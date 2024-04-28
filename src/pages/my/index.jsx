import { View, Text, Button, Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import Taro,{Current} from '@tarojs/taro'
import { AtButton, AtNoticebar, AtFab, AtGrid, AtList, AtListItem, AtAvatar, AtIcon } from 'taro-ui'
import './index.less'

export default function my() {
  const [isLogin, setIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
 
  const setLoginInfo = async (avatarUrl, nickName) => {
    setUserInfo({ avatarUrl, nickName })
  }

  async function onGetUserInfo(e) {
    setIsLogin(true)
    
    Taro.getUserInfo({
      success: function(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender 
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country
        console.log(userInfo)
        console.log(nickName,avatarUrl,gender,province,city,country)
      }
    })

    await props.setLoginInfo(avatarUrl, nickName)
 
    setIsLogin(false)
  }


  const autho = (res) => {
    Taro.getSetting()
    .then(res => {
      if (res.authSetting['scope.userInfo']) {
        Taro.getUserInfo()
          .then(userInfo => {
            const { nickName, avatarUrl } = userInfo.userInfo
            setLoginInfo(avatarUrl, nickName)
          })
          .catch(err => console.error(err))
      } else {
        Taro.authorize({
          scope: 'scope.userInfo',
          success: () => {
            Taro.getUserInfo()
              .then(userInfo => {
                const { nickName, avatarUrl } = userInfo.userInfo
                setLoginInfo(avatarUrl, nickName)
              })
              .catch(err => console.error(err))
          }
        })
      }
    })
    .catch(err => console.error(err))
  }

  const handleLogin = () => {
    Taro.login()
      .then(res => {
        if (res.code) {
          // 发送 res.code 到服务器换取用户唯一标识
          console.log('login code:', res.code)
        } else {
          console.error('获取用户登录态失败', res.errMsg)
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <View className='container'>
      <View className='post'>
        <Image src='https://i.imgur.com/Ulth94a.png'/>
      </View>

      <View className='main-bar'>
        <View className='avatar'>
          <AtAvatar circle image='https://jdc.jd.com/img/200' className='avatar-icon'></AtAvatar>
        </View>
        <View className='avatar-text'>
          未登录
          <AtIcon value='edit' size='30' color='#6C6C6C'></AtIcon>
        </View>

        <AtList className='option'>
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

        <View className='button-bar'>
          <Button className="button" onClick={autho}>
            授权
          </Button>
          <Button
            openType="getUserInfo"
            onGetUserInfo={onGetUserInfo}
            type="primary"
            className="login-button"
            loading={isLogin}>
            微信登录
          </Button>
          {/* <AtButton className='button' type='primary'>退出登录</AtButton> */}

          {userInfo && (
        <View>
          <Image src={userInfo.avatarUrl} />
          <Text className="nickname">{userInfo.nickName}</Text>
        </View>
      )}

        </View>
      </View>

      <View className='image'>
        <Image src='https://i.imgur.com/Ulth94a.png'/>
      </View>

    </View>
    
  )
}
