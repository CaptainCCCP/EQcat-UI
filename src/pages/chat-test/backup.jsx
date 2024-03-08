import Taro,{Current} from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './index.less'

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();  //防止自动触发
    if (input.trim() !== '') {  //如果不为空，执行
      const newMessage = {
        content: input,
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInput('');
      // 调用回复函数，可以根据输入的内容自定义逻辑
      replyToUser(input);
    }
  };

  const replyToUser = (input) => {
    //input为用户的上一条消息 不返回 将机器回复写入消息列表

    //TODO：调用api获取显示消息
    const replyMessage = {
      content: `你说了：${input}`,
      sender: 'bot',
    };

    setMessages([...messages, replyMessage]);

  };

  return (
    <View className="chatbot-container">
      <View className="chatbot-messages">
        {messages.map((message, index) => (
          <View key={index} className={`message ${message.sender}`}>
            {message.content}
          </View>
        ))}
      </View>

      <View className="chatbot-input">
        <input
          type="text"
          value={input}
          onInput={handleInputChange}
          placeholder="输入消息..."
        />
        <Button onClick={handleFormSubmit}>发送</Button>
      </View>

    </View>
  );

};