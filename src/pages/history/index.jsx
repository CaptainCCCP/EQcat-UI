import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export default function History() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='history'>
      <Text>Hello world!</Text>
    </View>
  )
}
