// import { View, Text, Button } from '@tarojs/components'
// import { useLoad } from '@tarojs/taro'
// import './index.less'
// import Taro from '@tarojs/taro'

// export default function Login() {
//   const handleWechatLogin = async () => {
//     try {
//       // 调用微信登录API
//       const res = await Taro.login();

//       if (res.code) {
//         // 将得到的code发送到服务器
//         const loginResponse = await Taro.request({
//           url: 'YOUR_SERVER_URL/api/wechat-login', // 替换为实际的服务器API URL
//           data: {
//             code: res.code
//           }
//         });

//         if (loginResponse.statusCode === 200) {
//           // 登录成功，处理服务器返回的数据
//           // 例如将用户token保存起来
//           Taro.setStorageSync('userToken', loginResponse.data.token);
//           // 登录成功后的其他操作...
//         } else {
//           // 处理登录失败情况
//           console.error('登录失败', loginResponse.data);
//         }
//       } else {
//         console.log('获取用户登录态失败！' + res.errMsg);
//       }
//     } catch (error) {
//       console.error('登录异常', error);
//     }
//   };

//   return (
//     <Button onClick={handleWechatLogin}>微信登录</Button>
//   )
// }

import Taro, { Current } from '@tarojs/taro'
import { useState,useEffect } from 'react'
import { View, Text, Button, Image, Input, ScrollView } from '@tarojs/components'
import { AtAvatar,AtRadio,AtIcon} from 'taro-ui'
 
import './index.less'
 
export default function LoginButton(props) {
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

  //授权信息
    // Taro.getSetting({
    //   success: function (res) {
    //     if (!res.authSetting['scope.record']) {
    //       Taro.authorize({
    //         scope: 'scope..userInfo',
    //         success: function () {
    //           console.log('hh')
    //           // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
    //           // Taro.startRecord()
    //         }
    //       })
    //     }
    //   }
    // })

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
    <View>

      <View>
        <Button
          openType="getUserInfo"
          onGetUserInfo={onGetUserInfo}
          type="primary"
          className="login-button"
          loading={isLogin}
        >
          微信登录
        </Button>

        <Button onClick={autho}>
          你好
        </Button>
        
      </View>

      {userInfo && (
        <View>
          <Image src={userInfo.avatarUrl} />
          <Text className="nickname">{userInfo.nickName}</Text>
        </View>
      )}
      <View>
        <Button className='login-btn' onClick={handleLogin}>
          获取用户登录态
        </Button>
      </View>


    </View>
    
    
  )
}

