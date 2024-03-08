import Taro,{Current} from '@tarojs/taro'
import { useState,useEffect } from 'react'
import { View, Text, Button,Image } from '@tarojs/components'
import './index.less'
// import Child from './child'

import { AtButton, AtNoticebar, AtFab, AtGrid, AtList, AtListItem, } from 'taro-ui'

function Index(){

  Taro.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        Taro.request({
          url: 'https://',
          data: {
            code: res.code
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
//获取微信登录凭证，通过wx.login获取，这个api会返回一个带有时效性的code
// 发送code给服务端
// 后端根据前端发送的code获取用户身份信息
// 后端处理完后，把用户信息和sessinId发送给前端，前端把需要的信息进行存储，接下来的请求就可以带着sessinId来表示身份


    Taro.setBackgroundColor({
      backgroundColorTop: '#123456', // 顶部窗口的背景色为白色
      backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
    })
//https://www.cnblogs.com/cczlovexw/p/13808842.html
// navigateTo: 最基本的跳转方式，可以返回上级页面
// redirectTo：不记录上集页面，直接跳转
// switchTab： Tab之间进行切换，这个要配合Taro的导航栏一起使用
// navigateBack: 返回上一级页面，这个在小程序中常使用
// relaunch：关闭所有额面，打开到应用内某个页面
// getCurrentPages: 获取当前页面信息所用

    const gotoMy=()=>{
        Taro.navigateTo({url:'/pages/upload/index'})//?Info=2
      }

    return(
      
      <view>
        <View className='index'>
          {/* <Image src={require("../../assets/images/4.png")} mode='aspectFit' style='width: 160px;height: 70px;background: #fff;'/> */}
        </View>
{/* 第一列 */}
        <View className='at-row'> 
          <View className='at-col at-col__offset-2'>
            一键搞定
          </View>

          <AtFab>
            <Text className='at-fab__icon at-icon at-icon-user'></Text>
          </AtFab>
        </View>
{/* 第二列 */}
        <View className='at-row'>
          <View className='at-col at-col__offset-2'>
            职场回复难题
          </View>
          <AtButton className='at-col at-col__offset-3' type='secondary' size='small' circle='true'>AI</AtButton>
        </View>

        <View className='at-row'>
          <AtNoticebar marquee icon='eye' speed= '110' className='at-noticebar at-col at-col-9'>
            急，在线等！甲方半夜发疯怎么回？
          </AtNoticebar>
          <AtNoticebar marquee icon='eye' speed= '110' className='at-noticebar at-col at-col-3'>
            跪
          </AtNoticebar>
        </View>

        <View className='at-row'>
          <AtNoticebar marquee icon='eye' speed= '90' className='at-noticebar at-col at-col-5'>
            怎么感谢领导的大恩大德
          </AtNoticebar>
          <AtNoticebar marquee icon='eye' speed= '90' className='at-noticebar at-col at-col-4'>
            领导居然敢PUA我！
          </AtNoticebar>
          <AtNoticebar marquee icon='eye' speed= '90' className='at-noticebar at-col at-col-3'>
            社恐怎么回复
          </AtNoticebar>
        </View>

        <View className='at-row'>
          <AtNoticebar marquee icon='eye' speed= '100' className='at-noticebar at-col at-col-7'>
            同时在大群里甩锅怎么办？
          </AtNoticebar>
          <AtNoticebar marquee icon='eye' speed= '100' className='at-noticebar at-col at-col-5'>
            又被骂了...
          </AtNoticebar>
        </View>


        <View>
          <AtButton className='at-button' type='primary' circle='true' onClick={gotoMy}>上传聊天记录截图</AtButton>
        </View>

        <View className='text2'>
          <Text>输入职场烦恼</Text>
        </View>

        <View className='small-list'>
          <AtList>
            <AtListItem
              title='使用案例'
              iconInfo={{ size: 25, color: '#78A4FA', value: 'clock', }}
            />
          </AtList>
        </View>

        <View>
          <AtList className='at-list'>
            <AtListItem className='at-list-item'
              title='甲方：你是不是听不懂我说话？？？'
              arrow='right'
              iconInfo={{ size: 15, color: '#78A4FA', value: 'add', }}
            />
            <AtListItem className='at-list-item'
              title='同事：这次上线事故都是小王自作主张'
              arrow='right'
              iconInfo={{ size: 15, color: '#FF4949', value: 'eye', }}
            />
            <AtListItem className='at-list-item'
              title='领导：这个月我们的销售业绩靠你了'
              arrow='right'
              iconInfo={{ size: 15, color: '#FF4949', value: 'clock', }}
            />
          </AtList>
        </View>

        {/* 下面要用到ScrollView */}
        <View>
          <AtList>
            <AtListItem
              title='点击查看更多'
              iconInfo={{ size: 25, color: '#78A4FA', value: 'chevron-down', }}
            />
          </AtList>
        </View>
        
      </view>
    )
}

export default Index

// navigateTo       redirectTo     switchTab     navigateBack      relaunch     getCurrentPages
// 可以返回上一页     没有上一页       tab           返回上一页