import { View, Text } from "@tarojs/components"
function Child(props){
    return(
        <view>
            <Text>
                Child.props:{props.userName}
            </Text>
        </view>
    )
}

export default Child