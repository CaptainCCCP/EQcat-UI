import Taro,{Current} from '@tarojs/taro'
import { View, Text, Button, Image, Input, ScrollView  } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './index.less'
import { AtAvatar,AtRadio } from 'taro-ui'

export default function ChatBot() {
  const recordID = 17
  //================================================================================
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
      const res = await Taro.request({
        url: 'http://server/agent/recognizeBackground',
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: {
          recordId: recordID
        }
      })

      setbackgroundResponse(JSON.stringify(res.data))
      if (backgroundresponse) {
        setMessages((prevMessage) => [
          ...prevMessage,
          { type: 'text', content: "已识别出聊天背景", isUser: false },
        ]);

        setCurrentIndex(currentIndex => currentIndex + 1);
        recognizeRelationRequest()
      } else {
        setMessages((prevMessage) => [
          ...prevMessage,
          { type: 'text', content: "未识别出聊天背景", isUser: false },
        ]);
        setCurrentIndex(currentIndex => currentIndex + 1);
        recognizeRelationRequest()
      }
    } catch (error) {
      console.error(error)
    }
  }
  //识别关系
  const recognizeRelationRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://server/agent/recognizeRelation',
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: {
          names: 'Doechii', 
          recordId: recordID
        }
      })

      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'text', content: `已识别出聊天对象为：${res.data.data}`, isUser: false },
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);

      setrelationResponse(JSON.stringify(res.data.data))

      complementRelationRequest()

    } catch (error) {
      console.error(error)
    }
  }

  //补全身份信息
  const complementRelationRequest = async () => {
    try {
      const requestData = {
        //TODO:将chatRecord设置为第一次输入的文本
          chatRecord: "hr：这次的校招生入职前都需要参与集团统一的入职培训，时间为2.26-4.26，记得回复邮件确认参加啊 Doechii：谢谢姐，主要是考虑到2-4月还有学校课程、毕业论文、实习，时间有点不够，请问这个集训是必须参加的吗？ hr：学校如果有安排可以请假，但是集训很重要，是关于公司的产品和业务的",
          details: [
            {
              //TODO:设置agentMsg 对方为识别出的relationResponse
              agentMsg: "喵喵想知道对方是谁？",
              choices: "",
              likes: "",
              recordId: recordID,
              status: "3",
              type: "1",
              //TODO：输入userMsg
              userMsg: "公司的hr"
            }
          ],
          names: [],
          //TODO:relation设置
          relation: "公司的hr"
      }
  
      const res = await Taro.request({
        url: 'http://server/agent/complementRelation?recordId='+ recordID,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: JSON.stringify(requestData)
      })

      console.log(relationresponse)
      console.log(res.data)
      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'fill', content: `喵喵想知道对方是谁？`, isUser: false },//${relationresponse}
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);


      setaskrelationResponse(JSON.stringify(res.data))
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
      const res = await Taro.request({
        url: 'http://server/agent/complementBackground',
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: {
          recordId: recordID
        }
      })
      if (res && res.data && res.data.data) {
      const regex = /提问：(.*)/;
      const match = res.data.data.match(regex);
      if (match && match.length > 1) {
        const extractedText = match[1];
        setAgentQuestion(JSON.stringify(extractedText))

        setMessages((prevMessage) => [
          ...prevMessage,
          { type: 'fill', content: extractedText, isUser: false },
        ]);
        setCurrentIndex(currentIndex => currentIndex + 1);
        //TODO:获取到fill的输入

        complementIntentionRequest()
      } else {
        console.log("No match found.");
      }
    }else{
      console.log("No data");
    }

    } catch (error) {
      console.error(error)
    }
  }

  //补全目的信息
  const complementIntentionRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://server/agent/complementIntention',
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: {
          //TODO：填装fill的输入
          ans: "是的",
          query:agentQuestion,
          recordId: recordID
        }
      })
      //TODO：让用户来选择
      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'choice', content: res.data.data.split(','), isUser: false },
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);

      setAgentChoice(res.data.data.split(','))
      for (let i = 0; i < agentChoice.length; i++) {
        console.log(res.data.data.split(',')[i]);
      }

      //
      summarizeRequest()

    } catch (error) {
      console.error(error)
    }
  }

  //总结
  const summarizeRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://server/agent/summarize',
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: {
          intention:agentChoice,
          recordId: recordID
        }
      })

      setMessages((prevMessage) => [
        ...prevMessage,
        { type: 'text', content: res.data.data, isUser: false },
      ]);
      setCurrentIndex(currentIndex => currentIndex + 1);

      setSummary(res.data.data)

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
    <View className="chatbot-page">

      <View className="conversation-container">
        {messages.map((item,index) => (
            <View className={`message${item.isUser ? '-right' : ''}`} key={index}>

                {item.isUser === false ? (
                  <AtAvatar text="Bot" size="small" circle image='../demo/src/assets/images/bot.png' className='avatar-left'/>
                ) : (
                  <AtAvatar text="You" size="small" circle image='../demo/src/assets/images/user.png' className='avatar-right'/>
                )}


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
  //================================================================================
};
