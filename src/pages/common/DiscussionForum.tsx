import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DiscussionForum: React.FC = () => {
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState([
    {
      id: 'p-1',
      author: 'Karthik Varma',
      role: 'Student Coordinator',
      title: 'Q&A: How to get started with PyTorch GPU acceleration in Lab 4?',
      content: 'Make sure your CUDA toolkit matches PyTorch version 2.4. Run torch.cuda.is_available() to test setup.',
      replies: [
        { author: 'Deepika Ramanathan', text: 'Verified! Lab 4 GPUs are working fast.', time: '1 hour ago' }
      ],
      time: '3 hours ago'
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPost || !currentUser) return;

    setPosts(prev => [
      {
        id: `p-${Date.now()}`,
        author: currentUser.full_name,
        role: currentUser.role,
        title: newTitle,
        content: newPost,
        replies: [],
        time: 'Just now'
      },
      ...prev
    ]);

    setNewTitle('');
    setNewPost('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center space-x-2">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          <span>Event Discussion & Technical Forum</span>
        </h1>
        <p className="text-xs text-slate-400">Ask questions, share code snippets, and collaborate with club members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handlePost} className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Start Discussion</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Topic Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Question regarding Weekly Contest #42"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Content</label>
              <textarea
                required
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Type details..."
                className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-glow transition-all"
          >
            Post Thread
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {posts.map(p => (
            <div key={p.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{p.author} ({p.role.replace('_', ' ')})</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{p.time}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{p.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{p.content}</p>

              {p.replies.length > 0 && (
                <div className="pt-2 space-y-2 border-t border-slate-800/80">
                  {p.replies.map((r, rIdx) => (
                    <div key={rIdx} className="p-2.5 rounded-xl bg-slate-900/90 text-xs border border-slate-800">
                      <span className="font-semibold text-slate-200">{r.author}: </span>
                      <span className="text-slate-300">{r.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
