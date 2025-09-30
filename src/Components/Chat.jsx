import React, { useState, useRef, useCallback, useEffect, act } from 'react'
// import send from './assets/send.svg';
// import upload from './assets/upload.svg';
import sideBar from '../assets/sideBar.svg';
import Spline from '@splinetool/react-spline';
import { X, Upload, Send, Menu, Edit2, Trash2, File, Image, FileText, Music, Video } from 'lucide-react';
import './Chat.css';
import api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { addPolicy, clearPolicy } from '../store/slices/userSlice';
import { addChatMessage, setActivePolicyName, clearChatHistory, setChatHistory } from '../store/slices/chatSlice';
import Header from './Header';


function Chat() {
  // Redux hooks
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const chatState = useSelector(state => state.chat);

  const fetchUserData = useCallback(async () => {
    const userName = userState.userName;
    try {
      const res = await api.post('/user/getuser', {
        userName: userName
      });

      // Handle response
      if (res.data && res.data.policies) {
        // Clear existing policies
        dispatch(clearPolicy());

        // Add each policy to the store
        res.data.policies.forEach(policy => {
          dispatch(addPolicy({
            policyId: policy.policyId,
            policyName: policy.policyName,
            indexName: policy.indexName,
            createdAt: policy.createdAt
          }));
        });
      }
      console.log("User state updated:", res.data);
    } catch (err) {
      console.error("Error fetching user state:", err);
    }
  }, [userState.userName, dispatch]);

  // Call the function when component mounts or userName changes
  useEffect(() => {
    console.log("UserState:", userState);
    if (userState.userName) {
      console.log("Fetching user data for:", userState.userName);
      fetchUserData();
    }
  }, [fetchUserData]);


  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg': return 'jpg';
      case 'jpeg': return 'jpeg';
      case 'png': return 'png';
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx':
        return 'doc';
      case 'txt':
        return 'txt';
      default:
        return 'unknown';
    }
  };


  const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
    const [fileName, setFileName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        setFileName(file.name);
      }
    };

    const handleUpload = async () => {
      if (selectedFile && fileName.trim()) {
        const formData1 = new FormData();
        formData1.append('file', selectedFile);
        formData1.append('policyName', activePolicyName);
        formData1.append('userName', userState.userName);
        console.log("File Details", activePolicyName, userState.userName)
        try {
          const res1 = await api.post('/user/upload', formData1, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }

          }
          );
          if (res1.status === 200) {
            console.log("File uploaded successfully to MongoDB:", res1.data);
          }
        } catch (err) {
          console.error("Error uploading Mongo DB file:", err);
          return;
        }
        const formData2 = new FormData();
        formData2.append('file', selectedFile);
        formData2.append('indexName', indexName);
        try {
          const res2 = await api.post('/vdb/upload', formData2, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (res2.status === 200) {
            console.log("File uploaded successfully to Pinecone:", res2.data);
            alert("File uploaded successfully completed");
            setFileName('');

          }
        } catch (err) {
          console.error("Error uploading Pinecone file:", err);
          return;
        }






        // Reset form
        setFileName('');

        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Uploaded Files</h3>

            <button onClick={onClose} className="close-btn">×</button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label>Select File</label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>

            <div className="form-group">
              <label>File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="text-input"
              />
            </div>


          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="cancel-btn">Cancel</button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !fileName.trim()}
              className="upload-btn"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };


  const FileItem = ({ file, onRename, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(file.name);

    const handleRename = () => {
      if (newName.trim() && newName !== file.name) {
        // TODO: Integrate with your MongoDB backend
        // updateFileInBackend(file.id, { name: newName });
        onRename(file.id, newName);
      }
      setIsEditing(false);
    };

    const handleDelete = () => {
      if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
        // TODO: Integrate with your MongoDB backend
        // deleteFileFromBackend(file.id);
        onDelete(file.id);
      }
    }
  };


  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]); // Fix: Add missing setFiles state
  const [inputMessage, setInputMessage] = useState('');


  const handleFileUpload = (fileData) => {
    setFiles(prev => [...prev, fileData]);
  };

  const handleFileRename = (fileId, newName) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, name: newName } : file
    ));
  };

  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // const handleSendMessage = () => {
  //   if (inputMessage.trim()) {
  //     const newMessage = {
  //       id: Date.now(),
  //       text: inputMessage,
  //       sender: 'user',
  //       timestamp: new Date().toISOString()
  //     };

  //     setMessages(prev => [...prev, newMessage]);
  //     setInputMessage('');

  //     // TODO: Send message to your AI backend
  //     // sendMessageToAI(inputMessage);
  //   }
  // };



  const [loading, setLoading] = useState(false);





  // const handleSendMessage = async () => {
  //   if (inputMessage.trim()) {
  //     const userMessage = {
  //       id: Date.now(),
  //       contents: inputMessage,
  //       role: 'user',
  //       timestamp: new Date().toISOString()
  //     };

  //     // Add user message to Redux store
  //     dispatch(addChatMessage(userMessage));
  //     setInputMessage('');

  //     try {
  //       // 👇 Send message to backend with policy information
  //       const res = await api.post('/vdb/agent', {
  //         userQuery: userMessage.contents,
  //         policyId: activePolicyId,
  //         indexName: indexName,
  //         userId: userId
  //       });
  //       console.log(res)  

  //       let parsedContent = null;

  //       // Try to parse structured content
  //       if (res.data.parsedContent) {
  //         try {
  //           parsedContent = typeof res.data.parsedContent === 'string' 
  //             ? JSON.parse(res.data.parsedContent) 
  //             : res.data.parsedContent;
  //           console.log("Parsed content:", parsedContent);  
  //         } catch (err) {
  //           console.warn("Could not parse structured content:", err);
  //         }
  //       }

  //       const aiMessage = {
  //         id: Date.now() + 1,
  //         contents: res.data.reply || res.data.message || res.data.response,
  //         parsedContent: parsedContent, // Store structured content
  //         role: 'assistant',
  //         timestamp: new Date().toISOString()
  //       };

  //       // Add AI response to Redux store
  //       dispatch(addChatMessage(aiMessage));
  //     } catch (err) {
  //       console.error('Failed to get response from AI backend:', err);
  //       const errorMessage = {
  //         id: Date.now() + 1,
  //         contents: 'Sorry, something went wrong.',
  //         role: 'assistant',
  //         timestamp: new Date().toISOString()
  //       };
  //       // Add error message to Redux store
  //       dispatch(addChatMessage(errorMessage));
  //     }
  //   }
  // };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        contents: inputMessage,
        role: 'user',
        timestamp: new Date().toISOString()
      };

      dispatch(addChatMessage(userMessage));
      setInputMessage('');
      setLoading(true); 

      try {
        const res = await api.post('/vdb/agent', {
          userQuery: userMessage.contents,
          policyId: activePolicyId,
          indexName: indexName,
          userId: userId
        });

        let parsedContent = null;
        if (res.data.parsedContent) {
          try {
            parsedContent = typeof res.data.parsedContent === 'string'
              ? JSON.parse(res.data.parsedContent)
              : res.data.parsedContent;
          } catch (err) {
            console.warn("Could not parse structured content:", err);
          }
        }

        const aiMessage = {
          id: Date.now() + 1,
          contents: res.data.reply || res.data.message || res.data.response,
          parsedContent: parsedContent,
          role: 'assistant',
          timestamp: new Date().toISOString()
        };

        dispatch(addChatMessage(aiMessage));
      } catch (err) {
        console.error('Failed to get response from AI backend:', err);
        const errorMessage = {
          id: Date.now() + 1,
          contents: 'Sorry, something went wrong.',
          role: 'assistant',
          timestamp: new Date().toISOString()
        };
        dispatch(addChatMessage(errorMessage));
      } finally {
        setLoading(false); 
      }
    }
  };



  const activePolicyName = useSelector(state => state.chat.activePolicyName);
  const activePolicyId = useSelector(state => state.chat.activePolicyId);
  const indexName = useSelector(state => state.chat.indexName);
  const userId = useSelector(state => state.user.userId);

  // Fix: Proper useEffect with async function
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (activePolicyId && userId) {
        try {
          console.log("Fetching chat history with:", activePolicyName, activePolicyId, indexName, userId);

          // Clear current chat history first
          dispatch(clearChatHistory());

          const res = await api.post('/user/chats', {
            policyId: activePolicyId,
            userId: userId
          });
          console.log("Chat history fetched:", res.data);

          // Update messages state with fetched chat history
          if (res.data && res.data.messages) {
            console.log("Setting chat history:", res.data.messages);
            dispatch(setChatHistory(res.data.messages));
          } else if (res.data && Array.isArray(res.data)) {
            console.log("Setting chat history from array:", res.data);
            dispatch(setChatHistory(res.data));
          } else {
            console.log("No messages found in response:", res.data);
            dispatch(clearChatHistory());
          }

        } catch (err) {
          console.error("Error fetching chat history:", err);
          // Clear chat history on error
          dispatch(clearChatHistory());
        }
      } else {
        // Clear chat history if no active policy or user
        dispatch(clearChatHistory());
      }
    };

    fetchChatHistory();


  }, [activePolicyName, activePolicyId, indexName, userId, dispatch]); // Add dispatch back to dependencies

  const policyList = useSelector(state => state.user.policies);

  // Fix: Better condition to set active policy
  useEffect(() => {
    console.log("Policy List updated:", policyList);
    console.log("Current activePolicyName:", activePolicyName);

    if (policyList && policyList.length > 0 && (!activePolicyName || activePolicyName === "")) {
      console.log("Setting active policy to:", policyList[0].policyName);
      dispatch(setActivePolicyName({
        policyName: policyList[0].policyName,
        policyId: policyList[0].policyId,
        indexName: policyList[0].indexName
      }));
    }
  }, [policyList, activePolicyName, dispatch]);
  const messages = useSelector(state => state.chat.chatHistory);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add debugging for messages
  useEffect(() => {
    console.log("Messages updated:", messages);
    scrollToBottom();
  }, [messages]);

  // Component to render structured AI response
  const StructuredResponse = ({ parsedContent }) => {
    if (!parsedContent) return null;

    const { decision, amount, justification, matched_clauses } = parsedContent;

    return (
      <div className="structured-response">
        <div className="decision-section">
          <h4 className="decision-title">Decision</h4>
          <span className={`decision-badge ${decision?.toLowerCase()}`}>
            {decision?.toUpperCase() || 'N/A'}
          </span>
        </div>

        {amount && amount !== 'N/A' && (
          <div className="amount-section">
            <h4 className="amount-title">Amount</h4>
            <p className="amount-value">{amount}</p>
          </div>
        )}

        {justification && (
          <div className="justification-section">
            <h4 className="justification-title">Justification</h4>
            <p className="justification-text">{justification}</p>
          </div>
        )}

        {matched_clauses && matched_clauses.length > 0 && (
          <div className="clauses-section">
            <h4 className="clauses-title">Relevant Policy Clauses</h4>
            <div className="clauses-list">
              {matched_clauses.map((clause, index) => (
                <div key={index} className="clause-item">
                  <div className="clause-text">"{clause.clause}"</div>
                  <div className="clause-role">{clause.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  const [display, setDisplay] = useState(false);
  const [uploadPolicy, setUploadPolicy] = useState({ name: "" });
  const [uploadIndexName, setUploadIndexName] = useState("");
  const handleAddPolicy = async () => {
    console.log("New policy name:", uploadPolicy);
    try {
      const res = await api.post('/user/create-policy',
        {
          policyName: uploadPolicy.name,
          userName: userState.userName // Ensure userName is passed
        }
      )
      try {
        const res2 = await api.post('/vdb/create-index', {
          indexName: res.data.indexName
        });
      } catch (err) {
        console.error("Error creating index:", err);
      }

      setUploadIndexName(res.data.indexName);
      setDisplay(false);
      // Reset the input
      setUploadPolicy({ name: "" });
      console.log("indexName:", res.data.indexName);

      // Call fetchUserData to refresh the policy list
      await fetchUserData();

    } catch (error) {
      console.error("Error adding policy:", error);
    }
  }
  return (
    <div className='all'>

      <div className={`sideBar ${sidebarOpen ? 'sidebar-open' : 'sidebar-close'}`}>
        <h2>
          Uploaded Files
        </h2>
        <div className="sidebar-content">

          {
            policyList.length === 0 ? (
              <div>
                <p className="no-files">No files uploaded yet</p>
                <div className='add-new-btn'
                  onClick={() => {
                    setDisplay(true);
                  }}
                > + </div>
              </div>
            ) : (
              <div className="files-list">
                {console.log("Policy List:", policyList)}
                {policyList.map(policy => (
                  <button
                    key={policy.policyId}
                    className={`file-item policy-button ${activePolicyName === policy.policyName ? 'active' : ''}`}
                    onClick={() => {
                      dispatch(setActivePolicyName({
                        policyName: policy.policyName,
                        policyId: policy.policyId,
                        indexName: policy.indexName
                      }));
                    }}
                  >
                    <div className="file-name">{policy.policyName}</div>
                    {activePolicyName === policy.policyName && (
                      <span className="active-indicator">✓</span>
                    )}
                  </button>
                ))}
                <div className='add-new-btn'
                  onClick={() => {
                    setDisplay(true);
                  }}
                > + </div>
              </div>
            )}
          {
            display && (
              <div>

                {/* Add your component content here */}
                {
                  <div>
                    <input className='policy-input' type="text" placeholder="Enter file name"
                      value={uploadPolicy.name}
                      onChange={(e) => setUploadPolicy({ name: e.target.value })}
                    />
                    <br />
                    <button
                      className="add-policy-button"
                      onClick={handleAddPolicy}
                    > Add File </button>
                  </div>
                }
              </div>
            )}

        </div>
      </div>

      <div className="left">
        <div className="bg_spline">
          <Spline scene="https://prod.spline.design/9bpGqvSTH0SW14lj/scene.splinecode" />
        </div>

        <div className="side_opener">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}><img src={sideBar} alt="sideBar Slider" /></button>
        </div>
      </div>


      <div className="right">
        {/* <Header /> */}
        <div className="chat_container">

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-messages">
                <p>Start a conversation...</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((message, index) => (
                  <div key={message._id || message.id || index} className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}>
                    <div className="message-content">
                      {message.role === 'assistant' && message.parsedContent ? (
                        <StructuredResponse parsedContent={message.parsedContent} />
                      ) : (
                        <p>{message.contents || message.text || message.message || 'No content'}</p>
                      )}
                      <span className="message-time">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'No time'}
                      </span>
                    </div>
                  </div>
                ))}

                
                {loading && (
                  <div className="message ai-message loading-message">
                    <div className="message-content">
                      <p><em>AI is typing...</em></p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

            )}
          </div>

          <div className="chatInput_container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything"
              className="chat_input"
            />

            <div className="tools">
              <div className="leftTool">
                <button onClick={() => setUploadModalOpen(true)}><Upload /></button>
              </div>
              <div className="rightTool">
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <Send />
                </button>
              </div>
            </div>

          </div>


          <FileUploadModal
            isOpen={uploadModalOpen}
            onClose={() => setUploadModalOpen(false)}
            onUpload={handleFileUpload}
          />
        </div>

      </div>

    </div>
  )
}

export default Chat
