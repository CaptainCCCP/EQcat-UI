import Taro,{Current, Component} from '@tarojs/taro'
import { useState,useEffect } from 'react'
import { View, Text, Button,Image, Input, ScrollView } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import './index.less'

export default function ChatPage() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleChoice = (choice) => {
    setConversation((prevConversation) => [
      ...prevConversation,
      { type: 'choice', content: choice, isUser: true },
    ]);
  };

  const handleFillBlank = (fill) => {
    setConversation((prevConversation) => [
      ...prevConversation,
      { type: 'fill', content: fill, isUser: true },
    ]);
  };


  const botReply = () => {
    //TODO
    // request接收后端数据实现
    const reply = '这里是机器人的回复';
    //设置回复样式text/choice/blank

    setConversation((prevConversation) => [
      ...prevConversation,
      { type: 'text', content: userInput, isUser: true },
      { type: 'text', content: reply, isUser: false },
    ]);
    setUserInput(''); 
  };

  return (
    <View className="chat-page">
      <ScrollView
        className="conversation-container"
        scrollY
      >
        {conversation.map((item, index) => (
          console.log(item),
          console.log(index),
          <View
            key={index}
            className={`message ${item.isUser ? 'user' : 'bot'}`}
          >
            <AtAvatar className='avatar' image={item.isUser ? '../demo/src/assets/images/user.png' : '../demo/src/assets/images/bot.png'}></AtAvatar>

            <View
              className={`content ${
                item.isUser ? 'user-content' : 'bot-content'
              }`}
            >
              {item.type === 'text' && <Text>{item.content}</Text>}
              {item.type === 'choice' && (
                <Text className="choice" onClick={() => handleChoice(item.content)}>
                  {item.content}
                </Text>
              )}
              {item.type === 'fill' && (
                <Input
                  className="fill-blank"
                  type="text"
                  value={item.content}
                  disabled
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="input-container">
        <Input
          className="user-input"
          type="text"
          placeholder="请输入..."
          adjustPosition='true'
          onInput={handleUserInput}
          onConfirm={botReply}
        />
        <Text className="submit-button" onClick={botReply}>
          发送
        </Text>
      </View>
    </View>
  );
}