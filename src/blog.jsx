import React, { useState, useEffect } from 'react';
import { Search, Heart, MessageCircle, Share2, Plus, X, User, Calendar, TrendingUp } from 'lucide-react';

export default function BlogPlatform() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, trending, following

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const keys = await window.storage.list('post:', true);
      
      if (keys && keys.keys) {
        const loadedPosts = await Promise.all(
          keys.keys.map(async (key) => {
            try {
              const result = await window.storage.get(key, true);
              return result ? JSON.parse(result.value) : null;
            } catch {
              return null;
            }
          })
        );
        
        const validPosts = loadedPosts
          .filter(p => p !== null)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setPosts(validPosts);
      }
    } catch (error) {
      console.log('No existing posts, starting fresh');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: Date.now().toString(),
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
      author: {
        name: 'You',
        handle: '@blogger',
        avatar: '🎨'
      }
    };

    try {
      await window.storage.set(`post:${post.id}`, JSON.stringify(post), true);
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '' });
      setShowComposer(false);
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await window.storage.delete(`post:${postId}`, true);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const toggleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedPost = {
      ...post,
      likes: post.likes + 1
    };

    try {
      await window.storage.set(`post:${postId}`, JSON.stringify(updatedPost), true);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1438 50%, #2d1b4e 100%)',
      fontFamily: '"Fraunces", serif',
      color: '#e8e3f0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: 0.4,
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(75, 0, 130, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 25s ease-in-out infinite reverse'
        }}></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300&family=Space+Mono:wght@400;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .post-card {
          animation: slideIn 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(138, 43, 226, 0.3);
        }

        .composer-backdrop {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn:hover {
          transform: scale(1.05);
        }

        .btn:active {
          transform: scale(0.95);
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.3);
        }

        .tab-btn {
          position: relative;
          transition: color 0.3s ease;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8a2be2, #9d4edd);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .tab-btn.active::after {
          transform: scaleX(1);
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <header style={{
          padding: '30px 0',
          borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
          marginBottom: '30px',
          background: 'rgba(10, 14, 39, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px 35px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, #e8e3f0 0%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
              letterSpacing: '-1px'
            }}>
              Thoughtstream
            </h1>
            <button
              onClick={() => setShowComposer(true)}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #8a2be2 0%, #9d4edd 100%)',
                border: 'none',
                borderRadius: '50px',
                padding: '14px 28px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: '"Space Mono", monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(138, 43, 226, 0.4)'
              }}
            >
              <Plus size={20} />
              New Post
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a78bfa',
              opacity: 0.7
            }} />
            <input
              type="text"
              placeholder="Search your thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{
                width: '100%',
                padding: '14px 50px',
                background: 'rgba(138, 43, 226, 0.1)',
                border: '2px solid rgba(138, 43, 226, 0.3)',
                borderRadius: '30px',
                color: '#e8e3f0',
                fontSize: '15px',
                fontFamily: '"Space Mono", monospace',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '30px',
            marginTop: '25px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(138, 43, 226, 0.2)'
          }}>
            {['all', 'trending', 'following'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab ? '#c4b5fd' : '#7c6f98',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: '"Space Mono", monospace',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  padding: '8px 0'
                }}
              >
                {tab === 'trending' && <TrendingUp size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Posts Feed */}
        <main>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                border: '4px solid rgba(138, 43, 226, 0.3)',
                borderTopColor: '#8a2be2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ marginTop: '20px', color: '#a78bfa', fontFamily: '"Space Mono", monospace' }}>
                Loading your thoughts...
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(138, 43, 226, 0.05)',
              borderRadius: '20px',
              border: '2px dashed rgba(138, 43, 226, 0.3)'
            }}>
              <p style={{
                fontSize: '24px',
                color: '#a78bfa',
                marginBottom: '15px',
                fontStyle: 'italic'
              }}>
                {searchQuery ? 'No posts found' : 'Your canvas awaits'}
              </p>
              <p style={{
                fontSize: '16px',
                color: '#7c6f98',
                fontFamily: '"Space Mono", monospace'
              }}>
                {searchQuery ? 'Try a different search term' : 'Share your first thought with the world'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="post-card"
                  style={{
                    background: 'rgba(10, 14, 39, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(138, 43, 226, 0.3)',
                    padding: '30px',
                    animationDelay: `${index * 0.1}s`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative corner accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, transparent 50%, rgba(138, 43, 226, 0.1) 50%)',
                    borderBottomLeftRadius: '100%'
                  }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8a2be2, #9d4edd)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      boxShadow: '0 4px 10px rgba(138, 43, 226, 0.3)'
                    }}>
                      {post.author.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#e8e3f0',
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        {post.author.name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#a78bfa',
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        {post.author.handle} · {formatDate(post.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="btn"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#fca5a5',
                        fontSize: '13px',
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#e8e3f0',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                    fontStyle: 'italic'
                  }}>
                    {post.title}
                  </h2>

                  <p style={{
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#c4b5fd',
                    marginBottom: '25px',
                    fontFamily: '"Space Mono", monospace',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {post.content}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '30px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(138, 43, 226, 0.2)'
                  }}>
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a78bfa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      <Heart size={18} />
                      {post.likes}
                    </button>
                    <button
                      className="btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a78bfa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      <MessageCircle size={18} />
                      {post.comments.length}
                    </button>
                    <button
                      className="btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a78bfa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        fontFamily: '"Space Mono", monospace'
                      }}
                    >
                      <Share2 size={18} />
                      {post.shares}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Post Composer Modal */}
      {showComposer && (
        <div
          className="composer-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowComposer(false);
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1438 100%)',
            borderRadius: '24px',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            padding: '35px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowComposer(false)}
              className="btn"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(138, 43, 226, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c4b5fd'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '25px',
              color: '#e8e3f0',
              fontStyle: 'italic'
            }}>
              Share a Thought
            </h2>

            <input
              type="text"
              placeholder="Give it a title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(138, 43, 226, 0.1)',
                border: '2px solid rgba(138, 43, 226, 0.3)',
                borderRadius: '12px',
                color: '#e8e3f0',
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '15px',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(138, 43, 226, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(138, 43, 226, 0.3)'}
            />

            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              style={{
                width: '100%',
                minHeight: '180px',
                padding: '16px',
                background: 'rgba(138, 43, 226, 0.1)',
                border: '2px solid rgba(138, 43, 226, 0.3)',
                borderRadius: '12px',
                color: '#e8e3f0',
                fontSize: '16px',
                lineHeight: 1.6,
                marginBottom: '25px',
                fontFamily: '"Space Mono", monospace',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(138, 43, 226, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(138, 43, 226, 0.3)'}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowComposer(false)}
                className="btn"
                style={{
                  background: 'rgba(138, 43, 226, 0.1)',
                  border: '2px solid rgba(138, 43, 226, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  color: '#c4b5fd',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: '"Space Mono", monospace'
                }}
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                className="btn"
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                style={{
                  background: newPost.title.trim() && newPost.content.trim()
                    ? 'linear-gradient(135deg, #8a2be2 0%, #9d4edd 100%)'
                    : 'rgba(138, 43, 226, 0.3)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: '"Space Mono", monospace',
                  boxShadow: newPost.title.trim() && newPost.content.trim()
                    ? '0 4px 15px rgba(138, 43, 226, 0.4)'
                    : 'none',
                  cursor: newPost.title.trim() && newPost.content.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}