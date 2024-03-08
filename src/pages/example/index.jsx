import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export default function Example() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='example'>
      <Text>Hello world!</Text>
    </View>
  )
}
