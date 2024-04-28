import Taro,{Current} from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import { AtAvatar,AtRadio,AtIcon,AtButton} from 'taro-ui'
import './index.less'

const AK = "V1Z0G4k6QqlvaZmqySCGiSZE";
const SK = "NKpdEQM8sNZHIk0xfb2YLbibs3KcmnRO";

export default function OCRComponent() {
  const [imageAwait, setimageAwait] = useState(''); // 识别结果
  const [recognizedText, setRecognizedText] = useState(''); // 识别结果
  const [imageList, setImageList] = useState([]) // 设置图片列表和方法
  const [deleteIndex, setDeleteIndex] = useState(-1); //删除要用到的

  const gotoChat=()=>{
    Taro.navigateTo({url:'/pages/chat/index'})
  }
  /**
   * 使用 AK，SK 生成鉴权签名（Access Token）
   * @return string 鉴权签名信息（Access Token）
   */
  const getAccessToken = async () => {
    const options = {
      method: 'POST',
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`,
    }
      try {
        const res = await Taro.request(options);
        const accessToken = res.data.access_token;
        return accessToken;
      } catch (error) {
        console.error(error);
      }
  };

const imageSeg = async(image)=>{
  try {
    const res = await Taro.request({
      method: 'POST',
      url: 'http://192.168.10.179:8086/predict/',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: {
        'image':image,
      }
    })
    console.log(res)
    setimageAwait(res.data.image)
    return res.data.image

    } catch (error) {
      console.error(error);
      throw error;
    }
}

const recognizeImage = async (image, accessToken)=>{

  try {
  const res = await Taro.request({
    method: 'POST',
    url: `https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token==${accessToken}`,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      'image':image,
      'detect_direction': 'false',
      'detect_language': 'false',
      'paragraph': 'false',
      'probability': 'false',
      'vertexes_location': 'false',
    }
  });

    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


//convert
const convertImageToBase64 = async (filePath) => {

    return new Promise((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'base64',
        success(res){
          resolve(res.data);
        },
        fail(res){
          console.error(res);
          reject(res);
        }
      })
    }
    )
}


const chooseImage = async () => {
//TODO: taro ui imgaepicker
  const res = await Taro.chooseImage({
    count: 6 - imageList.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album'],
    success:(res) => {
      const tempFilePaths = res.tempFilePaths;
      const newImageList = [...imageList, ...res.tempFilePaths];
      setImageList(newImageList)
    }
  })
}

const deleteImage = (index) => {
  setDeleteIndex(index);
  Taro.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        const newImageList = [...imageList];
        newImageList.splice(index, 1);
        setImageList(newImageList);
        setDeleteIndex(-1);
      } else {
        setDeleteIndex(-1);
      }
    },
  });
};


const uploadImage = async (imageList) => {
  for (let i = 0; i < imageList.length; i++) {
    const imagePath = imageList[i];

    // 使用 convertImageToBase64 函数将图片转换为 Base64 编码
    const base64Data = await convertImageToBase64(imagePath);
    const accessToken = await getAccessToken();
    const imageSeged = await imageSeg(base64Data)
    const responsi = await recognizeImage(imageSeged, accessToken);

    //提取出来用空格间隔开
    const recognizedText = responsi.data.words_result.map((result) => result.words).join('\n');
    //setRecognizedText(recognizedText);
    setRecognizedText((prevText) => prevText + '\n' + recognizedText); 
  }

}

const gotoHis=()=>{
  Taro.navigateTo({url:'/pages/history/index'})//?Info=2
}

return (
  <View className='chat-page'>

      <View className='top-bar'>
        <View className='top-bot'>
          <AtIcon value='user' size='25vh' color='#9A9A9A'></AtIcon>
          <View>Robot</View>
        </View>

        <View className='top-history'>
          <AtIcon value='clock' size='25vh' color='#9A9A9A' onClick={gotoHis}></AtIcon>
        </View>
      </View>

      <View className='chat-status'>
        <AtAvatar text="Bot" size='normal' image={require('../../assets/images/bot.png')} className='avatar-left'/>
        <View className='chat-box'>
          把你的职场烦恼告诉喵喵~
        </View>


      </View>

      <View className='text-container'>
        请输入你的职场烦恼
        <View className='text'>{recognizedText}</View>
      </View>

      <Button onClick={chooseImage}>+</Button>

    <View className="grid-container">

          {imageList.map((image, index) => (
            <View className="grid-item" key={index} onTap={() => deleteImage(index)}>
              <Image className="grid-image" mode="aspectFill" style='width: 75px;height: 75px;' key={index} src={image}/>
              {deleteIndex === index && <View className="delete-icon" />}
            </View>
          ))}

          {imageList.length < 6 && (//
        <View className="grid-item upload-icon" onTap={chooseImage} />
      )}
    </View>

      <Button className='send-button' onClick={() => uploadImage(imageList)}>发送</Button>
    
    <View>
      <Button onClick={gotoChat}>聊天</Button>
    </View>

  </View>
)

}
