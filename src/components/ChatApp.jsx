import React, { useEffect, useRef, useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from '@google/generative-ai';
import Header from './Header';
import NoMessages from "./NoMessages";
import GeminiTyping from './GeminiTyping';
import MarkdownCompObj from "./MarkdownCompObj";
import DeleteConfirmModal from './DeleteConfirmModal';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transformToLocalMessagesStructure = (data) => {
    const resultArr = data.map((item) => {
        let role = item?.role;
        let obj;
        if (role === "user") {
            obj = {
                sender: "user",
                text: item.parts[0].text
            };
        } else if (role === "model") {
            obj = {
                sender: "ai",
                text: item.parts[0].text,
                isGenerating: false,
            };
        }
        return obj;
    });
    return resultArr;
};

const ChatApp = () => {
    let phoenixChatHistory = localStorage.getItem("phoenixChatHistory");
    if (phoenixChatHistory) {
        phoenixChatHistory = JSON.parse(phoenixChatHistory);
    } else {
        phoenixChatHistory = [];
    }
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messages, setMessages] = useState(phoenixChatHistory ? transformToLocalMessagesStructure(phoenixChatHistory) : []);
    const [userInput, setUserInput] = useState("");
    const [isGeminiTyping, setIsGeminiTyping] = useState(false);
    // REF to hold the end of messages for scrolling
    const messageEndRef = useRef(null);
    // REF for Chat Session
    const chatSessionRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const changeHistory = (role, text) => {
        chatSessionRef.current._history = [...chatSessionRef.current._history, {
            role: role,
            parts: [{ text: text }],
        }];
        localStorage.setItem("phoenixChatHistory", JSON.stringify(chatSessionRef.current._history));
    };

    const handleDeleteHistory = (e) => {
        e.preventDefault();
        setIsDeleteModalOpen(true);
    }

    const clearHistoryAndMessages = () => {
        localStorage.removeItem("phoenixChatHistory");
        setMessages([]);
        chatSessionRef.current._history = [];
    }

    useEffect(() => {
        scrollToBottom();
        // Creates a CHAT Session that will save the history and the messages that we are doing only if already not present
        if (!chatSessionRef.current) {
            chatSessionRef.current = model.startChat({
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                },
                history: phoenixChatHistory,
            });
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        setUserInput('');
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", text: userInput }
        ]);
        setIsGeminiTyping(true);
        await delay(import.meta.env.VITE_RESPONSE_DELAY_IN_MS);
        try {
            let fullResponse = '';
            const result = await chatSessionRef.current.sendMessageStream(userInput);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: "ai",
                    text: '',
                    isGenerating: true
                }
            ]);
            setIsGeminiTyping(false);
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1),
                    {
                        sender: "ai",
                        text: fullResponse,
                        isGenerating: false
                    }
                ]);
            }

            setMessages((prevMessages) => [
                ...prevMessages.slice(0, -1),
                {
                    sender: "ai",
                    text: fullResponse,
                    isGenerating: false
                }
            ]);
            changeHistory("user", userInput);
            changeHistory("model", fullResponse);
        } catch (error) {
            console.log(error);
            setIsGeminiTyping(false);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: "ai",
                    text: 'Sorry, there was an unexpected error!',
                    isGenerating: false,
                }]);
        }

    };

    return (
        <div className='flex flex-col h-screen items-center bg-[#06051b]'>
            <Header />
            <DeleteConfirmModal isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} clearHistoryAndMessages={clearHistoryAndMessages} />
            <div className="flex-1 overflow-y-auto p-4 w-[100%] sm:w-[75%]" style={{
                scrollbarWidth: 'none'
            }}>
                {
                    messages.length === 0 && <NoMessages />
                }
                {
                    messages.map((message, index) => {
                        return (
                            <div key={index} className={`mb-4 flex flex-row gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {
                                    message.sender === 'ai' && (
                                        <img src="/phoenixAiLogo.png" alt="Phoenix Avatar" className='w-[20px] h-[20px] rounded-full border border-1 border-white mt-[4px]' />
                                    )
                                }
                                <div className={`inline-block p-2 rounded-lg max-w-[80%] text-justify
                                    ${message.sender === "user" ? 'bg-blue-700 text-white' : 'bg-[#3f576a] text-white ai-message'}`}>
                                    {
                                        message.sender === "user" ?
                                            (
                                                <span>
                                                    {message.text}
                                                </span>
                                            )
                                            :
                                            (
                                                <ReactMarkdown
                                                    className={`prose max-w-none px-2 ${message.isGenerating ? 'typingg-animation' : ''}`}
                                                    components={MarkdownCompObj}
                                                >
                                                    {
                                                        message.text
                                                        ||
                                                        'Thinking...'
                                                    }
                                                </ReactMarkdown>
                                            )
                                    }
                                </div>
                                {
                                    message.sender === 'user' && (
                                        <img src="/phoenixHumanAvatar.png" alt="Human Avatar" className='w-[20px] h-[20px] rounded-full border border-1 border-white mt-[4px]' />
                                    )
                                }
                            </div>
                        );
                    })
                }

                {
                    isGeminiTyping && <GeminiTyping />
                }
                <div ref={messageEndRef} />

            </div>

            <form onSubmit={handleSubmit} className='w-screen p-2 border border-x-0 border-b-0 border-t-blue-950 text-black'>
                <div className="flex items-center justify-center">
                    <button onClick={handleDeleteHistory} className={`mr-3 p-2 text-white rounded-full focus:outline-none ${phoenixChatHistory?.length ? 'bg-red-500 hover:bg-red-800' : 'bg-red-300'}`} title="Delete History" disabled={!phoenixChatHistory?.length}>
                        <Trash2 size={26} />
                    </button>
                    <input
                        type="text"
                        className="flex w-[100%] sm:w-[70%]  p-2 border rounded-lg rounded-r-none focus:outline-none"
                        value={userInput}
                        placeholder='Type a message...'
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent the default form submission
                                handleSubmit(e); // Call the submit handler
                            }
                        }}
                    />
                    <button type='submit' className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-800 focus:outline-none" title="Send Message">
                        <Send size={26} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatApp