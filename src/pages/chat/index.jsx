import Taro,{Current} from '@tarojs/taro'
import { View, Text, Button, Image, Input, ScrollView  } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './index.less'
import { AtAvatar,AtRadio,AtIcon} from 'taro-ui'

export default function ChatBot() {
  const recordID = 17
  //================================================================================
  //状态栏
  const [statusMessages, setstatusMessages] = useState('')
  //api相关
  const [backgroundresponse, setbackgroundResponse] = useState('')
  const [relationresponse, setrelationResponse] = useState('')
  const [askrelationresponse, setaskrelationResponse] = useState('')
  const [agentQuestion, setAgentQuestion] = useState('')
  const [agentChoice, setAgentChoice] = useState('')
  const [summary, setSummary] = useState('')
  //ui相关
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  //选择题
  const [selectedChoice, setSelectedChoice] = useState('');
  //填空
  const [Answered, setAnswered] = useState(false);

  //背景是否全面
  const recognizeBackgroundRequest = async () => {
    try {
      setbackgroundResponse(JSON.stringify('di1'))
        setMessages((prevMessage) => [
          ...prevMessage,
          { type: 'text', content: "已识别出聊天背景", isUser: false },
        ]);

        setCurrentIndex(currentIndex => currentIndex + 1);
        recognizeRelationRequest()

    } catch (error) {
      console.error(error)
    }
  }
  //识别关系
  const recognizeRelationRequest = async () => {
    try {

      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'text', content: `已识别出聊天对象为：nima`, isUser: false },
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);

      setrelationResponse(JSON.stringify('good'))

      complementRelationRequest()

    } catch (error) {
      console.error(error)
    }
  }

  //补全身份信息
  const complementRelationRequest = async () => {
    try {
      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'fill', content: `喵喵想知道对方是谁？`, isUser: false },//${relationresponse}
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);


      setaskrelationResponse(JSON.stringify('你好？'))
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (Answered) {
      complementBackgroundRequest();
    }
}, [Answered]);

  //补全背景
  const complementBackgroundRequest = async () => {
    try {
        setAgentQuestion(JSON.stringify('askquestion'))

        setMessages((prevMessage) => [
          ...prevMessage,
          { type: 'fill', content: 'askquestion', isUser: false },
        ]);
        setCurrentIndex(currentIndex => currentIndex + 1);
        //TODO:获取到fill的输入
        complementIntentionRequest()

    } catch (error) {
      console.error(error)
    }
  }

  //补全目的信息
  const complementIntentionRequest = async () => {
    try {
      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'choice', content: '选择选择', isUser: false },
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);

      setAgentChoice('选择')
      //
      summarizeRequest()

    } catch (error) {
      console.error(error)
    }
  }

  //总结
  const summarizeRequest = async () => {
    try {
      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'text', content: '总结', isUser: false },
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);

      setSummary('总结')

    } catch (error) {
      console.error(error)
    }
  }


//================================================================================
//chat里面的函数
  
//把用户输入暂存起来
  const handleUserInput = (e) => {
    setInput(e.target.value);
  };
//处理选项
  const handleChoice = (choice) => {
    setMessages((prevMessage) => [
      ...prevMessage,
      { type: 'choice', content: choice, isUser: false },
    ]);
    setCurrentIndex(currentIndex => currentIndex + 1);
  };
//处理填写
  const handleFillBlank = (fill) => {
    setMessages((prevMessage) => [
      ...prevMessage,
      { type: 'fill', content: fill, isUser: false },
    ]);

    setCurrentIndex(currentIndex => currentIndex + 1);
  };

//点击发送键
    const handleFormSubmit = (e) => {
      e.preventDefault();  //防止自动触发
      if (input.trim() !== '') {  //如果不为空，执行
          if(currentIndex==0){
            setMessages((prevMessage) => [
              ...prevMessage,
              { type: 'text', content: input, isUser: true },
            ]);
            setInput('');
            botReply(input);  //这里有逻辑
        }else{
          //TODO:阻止用户在运行时输入
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'text', content: input, isUser: true },
          ]);
          setAnswered(true);
          console.log("变true了")
          setInput('');
        }
      }
    };

  const botReply = (input) => {
    //TODO:将输入图片添加至数据库
    recognizeBackgroundRequest()
      // backgroundresponse
      // relationresponse
      // askrelationresponse

      // agentQuestion
      // agentChoice
      // summary

    setCurrentIndex(currentIndex => currentIndex + 1);
  };

  const ChooseChoice = (value) => {
    setSelectedChoice(value);
  };

  //================================================================================
  return (
    <View className="chat-page">

      <View className='top-bar'>
        <View className='top-bot'>
          <AtIcon value='user' size='25vh' color='#9A9A9A'></AtIcon>
          <View>Robot</View>
        </View>

        <View className='top-history'>
          <AtIcon value='clock' size='25vh' color='#9A9A9A'></AtIcon>
        </View>
      </View>

      <View className='chat-status'>
        <AtAvatar text="Bot" size='normal' image={require('../../assets/images/bot.png')} className='avatar-left'/>
        <View className='chat-box'>
          状态
        {/* {statusMessages.map((item,index) => (
              <View className='status-message' key={index}>
                
              </View>
            ))} */}
        </View>
      </View>

      <View className="conversation-container">
        {messages.map((item,index) => (
            <View className={`message${item.isUser ? '-right' : ''}`} key={index}>

                {/* {item.isUser === false ? (
                  <AtAvatar text="Bot" size='normal' image={require('../../assets/images/bot.png')} className='avatar-left'/>
                ) : (
                  <AtAvatar text="You" size="small" circle image={require('../../assets/images/user.png')} className='avatar-right'/>
                )} */}


              <View className="message-content">
                {item.type === 'text' && <Text>{item.content}</Text>}
                {item.type === 'choice' && (
                  <View className="choice-container">
                    {item.content.map((option, optionIndex) => (
                      <AtRadio
                        key={optionIndex}
                        options={[{ label: option, value: option }]}
                        value={selectedChoice}
                        onClick={ChooseChoice}
                        className="flexible-option"
                      />
                    ))}
                  </View>
                )}
                {item.type === 'fill' && (
                  <Text>{item.content}</Text>
                )}
              </View>
              
            </View>
          ))}
      </View>

      <View className="chatbot-input">
        <Input
          className="user-input"
          type="text"
          value={input}
          placeholder="请输入..."
          adjustPosition='true'
          onInput={handleUserInput}
          onConfirm={handleFormSubmit}
        />
        <Button className="submit-button" onClick={handleFormSubmit}>
          发送
        </Button>
      </View>

    </View>
  );
};
