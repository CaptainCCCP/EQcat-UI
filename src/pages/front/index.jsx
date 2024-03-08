import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Text, Button,Image } from '@tarojs/components'
import './index.less'

import { AtButton, AtNoticebar, AtFab, AtGrid } from 'taro-ui'

export default function Front() {

  Taro.request({
    url: 'https://nas.captaincccp.space', //仅为示例，并非真实的接口地址
    data: {
      x: '',
      y: ''
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log(res.data)
      console.log('111')
    }
  })



  //获取后端数据
  // const [articleList,setArticleList] = useState([])
  // const testHandler = () =>{
  //   Taro.request({
  //     url:'https://nas.captaincccp.space'
  //   }).then(res=>{
  //     console.log(res.data)
  //     setArticleList(res.data.list)
  //   })
  // }


  // return (
  //   <View className='components-page'>
  //     <view>text</view>
  //     <Button onClick={testHandler}>click</Button>
  //     {
  //       articleList.map((item, index)=>{
  //         return (<View key={index}>{item.title}</View>)
  //       })
  //     }
  //   </View>
  // )
}