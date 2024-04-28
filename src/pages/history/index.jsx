import { View, Text, Button,Image } from '@tarojs/components'
import Taro,{Current} from '@tarojs/taro'
import { useState,useEffect } from 'react'
import './index.less'
import { AtButton} from 'taro-ui'

export default function History() {
  const gotoUp=()=>{
    Taro.navigateTo({url:'/pages/upload/index'})//?Info=2
  }



  return (
    <View className='history-page'>

      <View className='top-bar'>
        <Text className='top-text'>当前没有对话记录哦~</Text>
        <Text className='top-text'>快告诉喵喵你的职场烦恼吧！</Text>
      </View>

      <View>
        <AtButton className='main-button' type='primary' circle='true' onClick={gotoUp}>上传聊天记录截图</AtButton>
      </View>

      <View className='text2'>
        <Text>输入职场烦恼</Text>
      </View>

    </View>
  )
}
