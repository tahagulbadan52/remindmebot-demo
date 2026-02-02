import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, FileText, Bell, Settings, Upload, Send, Check, CheckCheck, Paperclip, Image, Calendar, Clock, ChevronRight, Plus, Search, Menu, X, Download, Mail, Trash2, Edit2, User, Shield, LogOut } from 'lucide-react';

// Mock data
const mockReminders = [
  { id: 1, title: 'Passport Renewal', expiryDate: '2026-08-15', category: 'ID Documents', intervals: [90, 60, 30], status: 'active', daysLeft: 194 },
  { id: 2, title: 'Emirates ID', expiryDate: '2027-03-22', category: 'ID Documents', intervals: [90, 60, 30], status: 'active', daysLeft: 413 },
  { id: 3, title: 'Car Registration', expiryDate: '2026-04-10', category: 'Vehicle', intervals: [30, 14, 7], status: 'warning', daysLeft: 67 },
  { id: 4, title: 'Health Insurance', expiryDate: '2026-02-28', category: 'Insurance', intervals: [60, 30, 7], status: 'urgent', daysLeft: 26 },
  { id: 5, title: 'Driving License', expiryDate: '2028-11-05', category: 'ID Documents', intervals: [90, 60, 30], status: 'active', daysLeft: 1007 },
];

const mockDocuments = [
  { id: 1, name: 'Passport Copy', type: 'pdf', size: '2.4 MB', uploadedAt: '2025-12-10', category: 'ID Documents' },
  { id: 2, name: 'Emirates ID - Front', type: 'image', size: '1.1 MB', uploadedAt: '2025-11-22', category: 'ID Documents' },
  { id: 3, name: 'Emirates ID - Back', type: 'image', size: '0.9 MB', uploadedAt: '2025-11-22', category: 'ID Documents' },
  { id: 4, name: 'Car Registration Card', type: 'pdf', size: '0.8 MB', uploadedAt: '2026-01-05', category: 'Vehicle' },
  { id: 5, name: 'Insurance Policy', type: 'pdf', size: '3.2 MB', uploadedAt: '2025-10-15', category: 'Insurance' },
];

const botResponses = {
  greeting: "👋 Hello! I'm RemindMeBot, your personal document & reminder assistant.\n\nI can help you:\n📄 Store important documents\n⏰ Set expiry reminders\n📤 Retrieve & share files instantly\n\nHow can I help you today?",
  setReminder: "✅ Got it! I've set a reminder for your {item}.\n\n📅 Expiry: {date}\n🔔 I'll remind you: 90, 60, and 30 days before\n\nWould you like to upload a copy of the document?",
  uploadConfirm: "📎 Document received and securely stored!\n\n📄 {filename}\n🔒 Encrypted & backed up\n\nI'll keep it safe. Just ask anytime you need it!",
  retrieveDoc: "📄 Here's your {docname}:\n\n[Document Preview]\n\nWould you like me to:\n1️⃣ Send it here on WhatsApp\n2️⃣ Email it to someone",
  emailSent: "✉️ Done! I've sent your {docname} to {email}\n\nThey should receive it within a few minutes.",
  suggestion: "💡 Quick suggestion: Would you like to track your car service schedule? Many users find it helpful!\n\nJust say 'Yes' to set it up.",
  help: "Here's what I can do:\n\n📝 'Remind me when my [document] expires on [date]'\n📤 'Upload my [document]'\n📥 'Send me my [document]'\n✉️ 'Email my [document] to [email]'\n📋 'Show my reminders'\n\nWhat would you like to do?"
};

// WhatsApp Chat Simulator Component
const WhatsAppSimulator = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: botResponses.greeting, time: '10:30 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    let response = '';
    let delay = 1500;

    if (lowerMsg.includes('remind') && lowerMsg.includes('passport')) {
      response = botResponses.setReminder.replace('{item}', 'Passport').replace('{date}', '15 Aug 2026');
    } else if (lowerMsg.includes('remind') && lowerMsg.includes('car')) {
      response = botResponses.setReminder.replace('{item}', 'Car Registration').replace('{date}', '10 Apr 2026');
    } else if (lowerMsg.includes('upload')) {
      response = botResponses.uploadConfirm.replace('{filename}', 'passport_scan.pdf');
    } else if (lowerMsg.includes('send me') || lowerMsg.includes('get my')) {
      response = botResponses.retrieveDoc.replace('{docname}', 'Passport Copy');
    } else if (lowerMsg.includes('email') && lowerMsg.includes('@')) {
      const emailMatch = lowerMsg.match(/[\w.-]+@[\w.-]+\.\w+/);
      response = botResponses.emailSent.replace('{docname}', 'Passport Copy').replace('{email}', emailMatch ? emailMatch[0] : 'the specified address');
    } else if (lowerMsg.includes('help') || lowerMsg === '?') {
      response = botResponses.help;
    } else if (lowerMsg.includes('yes') || lowerMsg.includes('sure')) {
      response = "Great! 🎉 Let me set that up for you.\n\nWhen is your next car service due? You can tell me the date or say something like 'every 6 months'.";
    } else if (lowerMsg.includes('show') && lowerMsg.includes('reminder')) {
      response = "📋 Your active reminders:\n\n1. 🔴 Health Insurance - 26 days left\n2. 🟡 Car Registration - 67 days left\n3. 🟢 Passport - 194 days left\n4. 🟢 Emirates ID - 413 days left\n5. 🟢 Driving License - 1007 days left\n\nReply with a number to see details.";
    } else {
      response = "I'm here to help! Try saying:\n\n• 'Remind me when my passport expires on [date]'\n• 'Upload my Emirates ID'\n• 'Send me my passport'\n• 'Show my reminders'\n\nOr type 'help' for more options.";
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }]);
    }, delay);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
    
    setMessages(prev => [...prev, newMessage]);
    const userText = inputText;
    setInputText('');
    simulateBotResponse(userText);
  };

  const quickReplies = [
    "Remind me when my passport expires on 15 Aug 2026",
    "Show my reminders",
    "Send me my passport",
    "Upload my Emirates ID"
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      {/* WhatsApp Header */}
      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-[#2a3942]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">RemindMeBot</h3>
          <p className="text-xs text-emerald-400">online</p>
        </div>
        <Menu className="w-5 h-5 text-gray-400" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23202c33" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
              msg.type === 'user' 
                ? 'bg-[#005c4b] text-white rounded-br-none' 
                : 'bg-[#202c33] text-white rounded-bl-none'
            }`}>
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                <span className="text-[10px] text-gray-400">{msg.time}</span>
                {msg.type === 'user' && <CheckCheck className="w-4 h-4 text-blue-400" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] rounded-lg px-4 py-3 rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-[#0b141a] border-t border-[#2a3942]">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(reply)}
            className="flex-shrink-0 px-3 py-1.5 bg-[#202c33] hover:bg-[#2a3942] text-emerald-400 text-xs rounded-full border border-emerald-600/30 transition-colors"
          >
            {reply.length > 25 ? reply.substring(0, 25) + '...' : reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-gray-300">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-[#2a3942] text-white rounded-full px-4 py-2 text-sm focus:outline-none placeholder-gray-500"
        />
        <button 
          onClick={handleSend}
          className="p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Dashboard Components
const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'reminders', icon: Bell, label: 'Reminders' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold">RemindMe</h1>
            <p className="text-xs text-slate-400">Document Vault</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Demo User</p>
            <p className="text-xs text-slate-400">demo@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RemindersView = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Reminders</h2>
          <p className="text-slate-400 mt-1">Track expiry dates and never miss a deadline</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-sm text-slate-400">Urgent</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-sm text-slate-400">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-slate-400">On Track</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {mockReminders.map((reminder) => (
          <div 
            key={reminder.id}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:bg-slate-800 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${getStatusDot(reminder.status)}`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold">{reminder.title}</h3>
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">{reminder.category}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">Expires: {new Date(reminder.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl border ${getStatusColor(reminder.status)}`}>
                <span className="font-semibold">{reminder.daysLeft}</span>
                <span className="text-sm ml-1">days left</span>
              </div>
              <button className="p-2 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New Reminder</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Document Name</label>
                <input type="text" placeholder="e.g., Passport, Emirates ID" className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                <input type="date" className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                  <option>ID Documents</option>
                  <option>Vehicle</option>
                  <option>Insurance</option>
                  <option>Financial</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Remind me before</label>
                <div className="flex gap-2">
                  {['90 days', '60 days', '30 days', '7 days'].map((interval) => (
                    <label key={interval} className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg cursor-pointer hover:border-emerald-500">
                      <input type="checkbox" defaultChecked className="accent-emerald-500" />
                      <span className="text-sm text-slate-300">{interval}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentsView = () => {
  const getFileIcon = (type) => {
    return type === 'pdf' ? FileText : Image;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Documents</h2>
          <p className="text-slate-400 mt-1">Securely stored and ready when you need them</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-emerald-500">
          <option>All Categories</option>
          <option>ID Documents</option>
          <option>Vehicle</option>
          <option>Insurance</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mockDocuments.map((doc) => {
          const FileIcon = getFileIcon(doc.type);
          return (
            <div 
              key={doc.id}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  doc.type === 'pdf' ? 'bg-red-500/20' : 'bg-blue-500/20'
                }`}>
                  <FileIcon className={`w-6 h-6 ${doc.type === 'pdf' ? 'text-red-400' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{doc.name}</h3>
                  <p className="text-slate-400 text-sm">{doc.size} • {doc.category}</p>
                  <p className="text-slate-500 text-xs mt-1">Uploaded {doc.uploadedAt}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SettingsView = () => {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 mt-1">Manage your preferences and account</p>
      </div>

      {/* Profile Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" />
          Profile
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input type="text" defaultValue="Demo User" className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input type="email" defaultValue="demo@email.com" className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Number</label>
            <input type="tel" defaultValue="+971 50 123 4567" className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Reminder Intervals</label>
            <div className="flex flex-wrap gap-2">
              {['90 days', '60 days', '30 days', '14 days', '7 days', '1 day'].map((interval) => (
                <label key={interval} className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg cursor-pointer hover:border-emerald-500">
                  <input type="checkbox" defaultChecked={['90 days', '60 days', '30 days'].includes(interval)} className="accent-emerald-500" />
                  <span className="text-sm text-slate-300">{interval}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Reminder Time</label>
            <select className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>12:00 PM</option>
              <option>6:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Security & Privacy
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-400">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white font-medium">Export My Data</p>
              <p className="text-sm text-slate-400">Download all your documents and data</p>
            </div>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-600">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-sm text-slate-400">Permanently delete your account and data</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30">
              Delete
            </button>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
        Save Changes
      </button>
    </div>
  );
};

// Main App Component
export default function RemindMeBotPrototype() {
  const [view, setView] = useState('split'); // 'split', 'chat', 'dashboard'
  const [activeTab, setActiveTab] = useState('reminders');

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">RemindMeBot</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">PROTOTYPE</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'chat' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            WhatsApp Bot
          </button>
          <button
            onClick={() => setView('split')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'split' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'dashboard' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* WhatsApp Simulator */}
        {(view === 'chat' || view === 'split') && (
          <div className={`${view === 'split' ? 'w-96 border-r border-slate-700' : 'flex-1'} flex flex-col`}>
            <WhatsAppSimulator />
          </div>
        )}

        {/* Dashboard */}
        {(view === 'dashboard' || view === 'split') && (
          <div className="flex-1 flex overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'reminders' && <RemindersView />}
              {activeTab === 'documents' && <DocumentsView />}
              {activeTab === 'settings' && <SettingsView />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
