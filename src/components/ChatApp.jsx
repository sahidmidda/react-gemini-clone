import React, { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from '@google/generative-ai';
import Header from './Header';
import NoMessages from "./NoMessages";
import GeminiTyping from './GeminiTyping';
import MarkdownCompObj from "./MarkdownCompObj";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ChatApp = () => {
    const [messages, setMessages] = useState([

    ]);
    const [userInput, setUserInput] = useState("");
    const [isGeminiTyping, setIsGeminiTyping] = useState(false);
    // REF to hold the end of messages for scrolling
    const messageEndRef = useRef(null);
    // REF for Chat Session
    const chatSessionRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
                history: [],
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
                                        <img src="../src/assets/phoenixAiLogo.png" alt="Phoenix Avatar" className='w-[20px] h-[20px] rounded-full border border-1 border-white mt-[4px]' />
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
                                        <img src="../src/assets/phoenixHumanAvatar.png" alt="Human Avatar" className='w-[20px] h-[20px] rounded-full border border-1 border-white mt-[4px]' />
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
                    <input
                        type="text"
                        className="flex w-[100%] sm:w-[70%]  p-2 border rounded-lg rounded-r-none focus:outline-none"
                        value={userInput}
                        placeholder='Type a message...'
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-red-800 focus:outline-none">
                        <Send size={26} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatApp