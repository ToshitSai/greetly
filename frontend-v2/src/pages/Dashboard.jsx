import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingInput } from '../components/ui/FloatingInput';
import { TactileButton } from '../components/ui/TactileButton';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Copy, LogOut, ArrowLeft, Save, Edit2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';

export default function Dashboard() {
  const [view, setView] = useState('craft'); // 'history', 'craft'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: '',
    relationship: 'Friend',
    occasion: 'Birthday',
    tone: 'Funny',
    extraNotes: ''
  });

  const [emailData, setEmailData] = useState({
    email: '',
    subject: 'A special message just for you!'
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (view === 'history') {
      setHistoryLoading(true);
      api.getMessages()
        .then(res => {
          setHistory(res.data || res);
        })
        .catch(err => console.error("Failed to fetch history:", err))
        .finally(() => setHistoryLoading(false));
    }
  }, [view, currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        customer_id: currentUser ? currentUser.id : 0,
        recipient_id: 1, 
        occasion_id: 1, 
        tone_id: 1, 
        relationship: formData.relationship,
        extra_note: formData.extraNotes
      };
      
      const res = await api.generateMessage({
        ...payload,
        recipient_name: formData.recipientName,
        occasion_name: formData.occasion,
        tone_name: formData.tone
      });
      
      const generatedMessage = res.data || {};
      setActiveMessage(generatedMessage.id ? generatedMessage : null);
      setResult(generatedMessage.message_text || generatedMessage.message || "Generated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Error generating message: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await api.sendEmail(emailData.email, formData.recipientName, result, emailData.subject);
      setEmailModalOpen(false);
      alert("Email sent successfully!");
    } catch (err) {
      alert("Error sending email: " + err.message);
    }
  };

  const downloadMessage = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "greetly-message.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleSaveMessage = async () => {
    if (!result) return;

    setIsSaving(true);
    try {
      if (activeMessage?.id) {
        const res = await api.saveMessage(activeMessage.id);
        setActiveMessage(res.data || activeMessage);
      }
      downloadMessage();
    } catch (err) {
      alert("Error saving message: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!activeMessage?.id) {
      setIsEditing(false);
      return;
    }

    try {
      const res = await api.editMessage(activeMessage.id, result);
      setActiveMessage(res.data || activeMessage);
      setResult(res.data?.message_text || result);
      setIsEditing(false);
    } catch (err) {
      alert("Error updating message: " + err.message);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 relative z-10 max-w-4xl mx-auto flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-12">
        <Link to="/">
          <div className="bg-brand-red border-[3px] border-brand-black shadow-comic-sm px-4 py-1 rounded-full transform -rotate-2 hover:scale-105 transition-transform">
            <span className="font-display font-black text-white text-xl tracking-wider">GREETLY</span>
          </div>
        </Link>
        
        <div className="flex gap-4 items-center">
          <div className="bg-white border-[3px] border-brand-black shadow-comic-sm px-4 py-2 rounded-lg font-bold">
            Hi, {currentUser ? currentUser.name.split(' ')[0] : 'Creator'}! 👋
          </div>
          <button onClick={handleLogout} className="bg-brand-yellow border-[3px] border-brand-black shadow-comic-sm p-2 rounded-full hover:-translate-y-1 hover:shadow-comic transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'history' ? (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div className="comic-panel p-8 bg-white mb-10 relative">
               <div className="absolute -top-4 -left-4 bg-brand-cyan border-[3px] border-brand-black px-4 py-1 rounded-full font-black uppercase text-sm shadow-comic-sm transform -rotate-3">
                 Profile Details
               </div>
               <div className="mt-2 text-brand-black flex flex-col gap-2">
                 <p className="font-body text-xl"><strong>Name:</strong> {currentUser?.name}</p>
                 <p className="font-body text-xl"><strong>Email:</strong> {currentUser?.email}</p>
               </div>
            </div>

            <div className="flex justify-between items-end mb-6 border-b-[4px] border-brand-black pb-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-brand-black">Message History</h2>
              <TactileButton variant="primary" onClick={() => { setView('craft'); setResult(null); }} className="px-6 py-2">
                <Sparkles size={18} className="inline mr-2"/> CRAFT NEW
              </TactileButton>
            </div>

            {historyLoading ? (
              <div className="text-center py-10 font-bold text-xl">Loading your magic...</div>
            ) : history.length > 0 ? (
              <div className="flex flex-col gap-4 mb-12">
                {history.map((msg, i) => {
                  const dateObj = new Date(msg.created_at);
                  const dateStr = dateObj.toLocaleDateString();
                  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                  <div 
                    key={i} 
                    onClick={() => {
                      setActiveMessage(msg);
                      setResult(msg.message_text);
                      setFormData({
                        recipientName: msg.recipient_name || '',
                        relationship: msg.relationship || 'Friend',
                        occasion: msg.occasion_name || 'Birthday',
                        tone: msg.tone_name || 'Funny',
                        extraNotes: ''
                      });
                      setIsEditing(false);
                      setView('craft');
                    }}
                    className="comic-panel p-4 bg-brand-yellow relative cursor-pointer hover:-translate-y-1 hover:shadow-comic transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div>
                      <h3 className="text-xl font-black uppercase mb-2 group-hover:text-brand-purple transition-colors">
                        For: {msg.recipient_name || 'Someone Special'}
                      </h3>
                      <div className="flex gap-2">
                        <span className="bg-brand-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {msg.occasion_name || 'Occasion'}
                        </span>
                        <span className="bg-white border-[2px] border-brand-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {msg.tone_name || 'Tone'}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex flex-col sm:items-end">
                      <span className="text-base font-bold bg-white px-2 py-1 border-[2px] border-brand-black rounded shadow-comic-sm mb-1">{dateStr}</span>
                      <span className="text-xs font-bold opacity-70">{timeStr}</span>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="comic-panel p-10 bg-brand-purple text-white text-center">
                <p className="font-bold text-xl mb-6">Your history is empty! Time to make some magic.</p>
                <TactileButton variant="primary" className="!bg-brand-yellow !text-brand-black" onClick={() => { setView('craft'); setResult(null); }}>
                  START CRAFTING
                </TactileButton>
              </div>
            )}
          </motion.div>
        ) : view === 'craft' && !result ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full comic-panel p-8 bg-brand-yellow relative"
          >
            <div className="absolute -top-6 right-2 md:-right-6 bg-brand-purple text-white border-[3px] border-brand-black px-4 py-2 rounded-full font-black uppercase text-sm shadow-comic-sm z-10 transform rotate-6">
              Let's Create
            </div>

            <div className="flex items-center gap-4 mb-8 border-b-[4px] border-brand-black pb-4">
              <button onClick={() => setView('history')} className="bg-white border-2 border-brand-black p-2 rounded-full hover:scale-110 transition-transform">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">
                Craft a Message
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FloatingInput 
                id="recipientName" 
                label="Recipient's Name" 
                value={formData.recipientName}
                onChange={e => setFormData({...formData, recipientName: e.target.value})}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-display font-bold px-2">Relationship</label>
                  <select 
                    className="input-comic appearance-none bg-white cursor-pointer"
                    value={formData.relationship}
                    onChange={e => setFormData({...formData, relationship: e.target.value})}
                  >
                    <option>Friend</option>
                    <option>Partner</option>
                    <option>Family</option>
                    <option>Colleague</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-bold px-2">Occasion</label>
                  <select 
                    className="input-comic appearance-none bg-white cursor-pointer"
                    value={formData.occasion}
                    onChange={e => setFormData({...formData, occasion: e.target.value})}
                  >
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Congratulations</option>
                    <option>Just Because</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-display font-bold px-2">Tone</label>
                  <select 
                    className="input-comic appearance-none bg-white cursor-pointer"
                    value={formData.tone}
                    onChange={e => setFormData({...formData, tone: e.target.value})}
                  >
                    <option>Funny</option>
                    <option>Heartfelt</option>
                    <option>Casual</option>
                    <option>Formal</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="font-display font-bold px-2">Extra Context (Optional)</label>
                <textarea 
                  className="input-comic min-h-[100px] resize-none"
                  placeholder="e.g. Inside jokes, shared memories..."
                  value={formData.extraNotes}
                  onChange={e => setFormData({...formData, extraNotes: e.target.value})}
                ></textarea>
              </div>

              <TactileButton type="submit" variant="primary" className="py-4 text-xl mt-4 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? "CRAFTING..." : <><Sparkles size={24} /> GENERATE MAGIC</>}
              </TactileButton>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => { setResult(null); setView('history'); }} className="bg-white border-[3px] border-brand-black p-2 rounded-full hover:scale-110 transition-transform">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-black uppercase">Back to Dashboard</h2>
            </div>
          
            <div className="comic-panel p-8 bg-white relative mb-8 transform -rotate-1">
              <div className="absolute -top-6 left-2 md:-left-6 bg-brand-cyan border-[3px] border-brand-black px-4 py-2 rounded-full font-black uppercase text-sm shadow-comic-sm z-10 transform -rotate-6">
                Your Masterpiece
              </div>
              
              {isEditing ? (
                <textarea 
                  className="w-full text-xl font-body font-bold leading-relaxed mt-4 p-4 bg-brand-yellow/20 rounded border-2 border-dashed border-brand-black/40 min-h-[150px] outline-none focus:border-brand-black focus:bg-brand-yellow/30 transition-colors"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="text-xl font-body font-bold leading-relaxed whitespace-pre-wrap mt-4 p-4 bg-brand-yellow/20 rounded border-2 border-dashed border-brand-black/20 min-h-[150px]">
                  {result}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 relative">
              <TactileButton onClick={() => {
                navigator.clipboard.writeText(result);
                setShowCopyPopup(true);
                setTimeout(() => setShowCopyPopup(false), 2000);
              }} variant="secondary" className="flex-1 min-w-[150px] flex items-center justify-center gap-2 bg-white !text-brand-black border-[3px] relative">
                {showCopyPopup && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-brand-black text-white px-4 py-2 rounded-full font-bold text-sm shadow-comic whitespace-nowrap z-50 animate-bounce">
                    Text Copied!
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-black rotate-45"></div>
                  </div>
                )}
                <Copy size={20} /> Copy
              </TactileButton>
              <TactileButton onClick={handleSaveMessage} disabled={isSaving} variant="secondary" className="flex-1 min-w-[150px] flex items-center justify-center gap-2 !bg-[#06D6A0] !text-brand-black border-[3px]">
                <Save size={20} /> {isSaving ? "Saving" : "Save"}
              </TactileButton>
              <TactileButton onClick={handleEditToggle} variant="secondary" className="flex-1 min-w-[150px] flex items-center justify-center gap-2 !bg-brand-yellow !text-brand-black border-[3px]">
                <Edit2 size={20} /> {isEditing ? "Done" : "Edit"}
              </TactileButton>
              <TactileButton onClick={(e) => handleSubmit(e)} variant="primary" className="flex-1 min-w-[150px] flex items-center justify-center gap-2 !bg-brand-purple !text-white border-[3px]">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Regenerate
              </TactileButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {emailModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="comic-panel p-8 bg-brand-cyan w-full max-w-md relative"
            >
              <button 
                onClick={() => setEmailModalOpen(false)}
                className="absolute -top-4 right-2 md:-right-4 bg-brand-red text-white w-10 h-10 rounded-full border-4 border-brand-black font-black text-xl flex items-center justify-center shadow-comic-sm z-10 hover:scale-110 transition-transform"
              >
                X
              </button>
              
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">Send Email</h2>
              
              <form onSubmit={handleSendEmail} className="flex flex-col gap-6">
                <FloatingInput 
                  id="email" 
                  type="email"
                  label="Recipient's Email" 
                  required
                  value={emailData.email}
                  onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                />
                <FloatingInput 
                  id="subject" 
                  label="Subject Line" 
                  required
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                />
                
                <TactileButton type="submit" variant="primary" className="w-full py-4 mt-2 text-lg">
                  SEND IT!
                </TactileButton>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
