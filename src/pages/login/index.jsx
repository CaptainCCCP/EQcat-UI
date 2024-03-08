import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'
import Taro from '@tarojs/taro'

export default function Login() {
  const handleWechatLogin = async () => {
    try {
      // 调用微信登录API
      const res = await Taro.login();

      if (res.code) {
        // 将得到的code发送到服务器
        const loginResponse = await Taro.request({
          url: 'YOUR_SERVER_URL/api/wechat-login', // 替换为实际的服务器API URL
          data: {
            code: res.code
          }
        });

        if (loginResponse.statusCode === 200) {
          // 登录成功，处理服务器返回的数据
          // 例如将用户token保存起来
          Taro.setStorageSync('userToken', loginResponse.data.token);
          // 登录成功后的其他操作...
        } else {
          // 处理登录失败情况
          console.error('登录失败', loginResponse.data);
        }
      } else {
        console.log('获取用户登录态失败！' + res.errMsg);
      }
    } catch (error) {
      console.error('登录异常', error);
    }
  };

  return (
    <Button onClick={handleWechatLogin}>微信登录</Button>
  )
}