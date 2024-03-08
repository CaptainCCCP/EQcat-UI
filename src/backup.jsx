
import Taro,{Current} from '@tarojs/taro'
import { View, Text, Button, Image, Input, ScrollView  } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './index.less'
import { AtAvatar } from 'taro-ui'

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

  //背景是否全面
  const recognizeBackgroundRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://39.105.198.168:8081/agent/recognizeBackground',
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
        recognizeRelationRequest()
      } else {
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
        url: 'http://39.105.198.168:8081/agent/recognizeRelation',
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

      setrelationResponse(JSON.stringify(res.data))
      complementRelationRequest()
    } catch (error) {
      console.error(error)
    }
  }

  //补全身份信息
  const complementRelationRequest = async () => {
    try {
      const requestData = {
          chatRecord: "hr：这次的校招生入职前都需要参与集团统一的入职培训，时间为2.26-4.26，记得回复邮件确认参加啊 Doechii：谢谢姐，主要是考虑到2-4月还有学校课程、毕业论文、实习，时间有点不够，请问这个集训是必须参加的吗？ hr：学校如果有安排可以请假，但是集训很重要，是关于公司的产品和业务的",
          details: [
            {
              agentMsg: "喵喵想知道对方是谁？",
              choices: "",
              likes: "",
              recordId: recordID,
              status: "3",
              type: "1",
              userMsg: "公司的hr"
            }
          ],
          names: [],
          relation: "公司的hr"
      }
  
      const res = await Taro.request({
        url: 'http://39.105.198.168:8081/agent/complementRelation?recordId='+ recordID,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: JSON.stringify(requestData)
      })

      setaskrelationResponse(JSON.stringify(res.data))
      complementBackgroundRequest()
    } catch (error) {
      console.error(error)
    }
  }

  //补全背景
  const complementBackgroundRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://39.105.198.168:8081/agent/complementBackground',
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

      const regex = /提问：(.*)/;
      const match = res.data.data.match(regex);
      if (match && match.length > 1) {
        const extractedText = match[1];
        setAgentQuestion(JSON.stringify(extractedText))
        complementIntentionRequest()
      } else {
        console.log("No match found.");
      }

    } catch (error) {
      console.error(error)
    }
  }

  //补全目的信息
  const complementIntentionRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://39.105.198.168:8081/agent/complementIntention',
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'user-id': 1,
          'user-nickname': 'Doechii',
        },
        data: {
          ans: "Doechii提到时间不够，这是否意味着他/她正在考虑如何妥善管理好自己的时间，以平衡入职培训、学校课程、毕业论文和实习等多重任务？",
          query:agentQuestion,
          recordId: recordID
        }
      })

      setAgentChoice(res.data.data.split(',')[0])
      // for (let i = 0; i < array.length; i++) {
      //   console.log(agentChoice[i]);
      // }
      summarizeRequest()
    } catch (error) {
      console.error(error)
    }
  }

  //总结
  const summarizeRequest = async () => {
    try {
      const res = await Taro.request({
        url: 'http://39.105.198.168:8081/agent/summarize',
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

      setSummary(res.data.data)

    } catch (error) {
      console.error(error)
    }
  }
  //================================================================================
  //ui相关
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

//================================================================================
//chat里面的函数
  
//把用户输入暂存起来
  const handleUserInput = (e) => {
    setInput(e.target.value);
  };
//处理选项
  const handleChoice = (choice) => {
    setMessages([
      ...messages,
      { type: 'choice', content: choice, isUser: false },
    ]);
  };
//处理填写
  const handleFillBlank = (fill) => {
    setMessages([
      ...messages,
      { type: 'fill', content: fill, isUser: false },
    ]);
  };

//点击发送键
    const handleFormSubmit = (e) => {
      e.preventDefault();  //防止自动触发
      if (input.trim() !== '') {  //如果不为空，执行
          const newMessage = {
          type:'text',
          content: input,
          isUser: true,
          };
          setMessages([...messages, newMessage]);
          setInput('');
          // 调用回复函数，可以根据输入的内容自定义逻辑
          botReply(input);  //这里有逻辑
      }
    };

  const botReply = (input) => {

    // request接收后端数据实现
    const reply = '这里是机器人的回复:${input}';
    //设置回复样式text/choice/blank
    const newMessage = { type: 'text', content: reply, isUser: false }
    setMessages([...messages, newMessage]);
  };


  //================================================================================
  return (
    <View className="chatbot-page">

      <ScrollView className="conversation-container" scrollY>
        {messages.map((item, index) => (
          <View
            key={index}
            className={`message ${item.isUser ? 'user' : 'bot'}`}
          >
            {/* 正式开始一条消息 */}
            <AtAvatar className='avatar' image={item.isUser ? '../demo/src/assets/images/user.png' : '../demo/src/assets/images/bot.png'}></AtAvatar>

            <View className={`content ${item.isUser ? 'user-content' : 'bot-content'}`}>
              {item.type === 'text' && <Text>{item.content}</Text>}
              {item.type === 'choice' && (
                <Text className="choice" onClick={() => handleChoice(item.content)}>
                  {item.content}
                </Text>
              )}
              {item.type === 'fill' && (
                <Input className="fill-blank" type="text" value={item.content} disabled/>
              )}
            </View>
          </View>
        ))
        }
      </ScrollView>

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
















//最简chat界面
// import Taro,{Current} from '@tarojs/taro'
// import { View, Text, Button, Image } from '@tarojs/components'
// import { useState,useEffect } from 'react'
// import './index.less'

// export default function ChatBot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();  //防止自动触发
//     if (input.trim() !== '') {  //如果不为空，执行
//       const newMessage = {
//         content: input,
//         sender: 'user',
//       };
//       setMessages([...messages, newMessage]);
//       setInput('');
//       // 调用回复函数，可以根据输入的内容自定义逻辑
//       replyToUser(input);
//     }
//   };

//   const replyToUser = (input) => {
//     //input为用户的上一条消息 不返回 将机器回复写入消息列表

//     //TODO：调用api获取显示消息
//     const replyMessage = {
//       content: `你说了：${input}`,
//       sender: 'bot',
//     };

//     setMessages([...messages, replyMessage]);

//   };

//   return (
//     <View className="chatbot-container">
//       <View className="chatbot-messages">
//         {messages.map((message, index) => (
//           <View key={index} className={`message ${message.sender}`}>
//             {message.content}
//           </View>
//         ))}
//       </View>

//       <View className="chatbot-input">
//         <input
//           type="text"
//           value={input}
//           onInput={handleInputChange}
//           placeholder="输入消息..."
//         />
//         <Button onClick={handleFormSubmit}>发送</Button>
//       </View>

//     </View>
//   );

// };

{messages.slice(0, currentIndex + 1).map((item, index) => (
    <View key={index} className={`message ${item.isUser ? 'user' : 'bot'}`}>
      {/* 正式开始一条消息 */}
      <AtAvatar className='avatar' image='https://jdc.jd.com/img/200'//</View>{item.isUser ? '../demo/src/assets/images/user.png' : '../demo/src/assets/images/bot.png'}
      ></AtAvatar>

      {/* <View className={`content ${item.isUser ? 'user-content' : 'bot-content'}`}> */}
        {item.type === 'text' && <Text>{item.content}</Text>}

        {item.type === 'choice' && (
          <Text className="choice" onClick={() => handleChoice(item.content)}>
            {item.content}
          </Text>
        )}

        {item.type === 'fill' && (
          <Input className="fill-blank" type="text" value={item.content} disabled/>
        )}

      {/* </View> */}
    </View>
  ))
  }



  {messages.slice(0, currentIndex + 1).map((item, index) => (