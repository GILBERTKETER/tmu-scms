"use client"
import React, { useState } from 'react';
import { Button, Input, Card, Comment, Avatar, List } from '@arco-design/web-react';
import { IconMessage } from '@arco-design/web-react/icon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import rehypeRaw from 'rehype-raw';
import { v4 as uuidv4 } from 'uuid'; 
import 'tailwindcss/tailwind.css';

interface Post {
  id: string;
  author: string;
  content: string;
  avatar: string;
  replies: Reply[];
  createdAt: Date;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  avatar: string;
  createdAt: Date;
}

const IncidentReporting: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({}); 

  const handleAddPost = () => {
    if (!newPost) return;
    const post: Post = {
      id: uuidv4(),
      author: 'John Doe', 
      content: newPost,
      avatar: 'https://i.pravatar.cc/150?img=1',
      replies: [],
      createdAt: new Date(),
    };
    setPosts([post, ...posts]);
    setNewPost(''); 
  };

  const handleReply = (postId: string) => {
    if (!newReply[postId]) return;
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const reply: Reply = {
          id: uuidv4(),
          author: 'Jane Doe',
          content: newReply[postId],
          avatar: 'https://i.pravatar.cc/150?img=2',
          createdAt: new Date(),
        };
        post.replies.push(reply);
      }
      return post;
    });
    setPosts(updatedPosts);
    setNewReply({ ...newReply, [postId]: '' });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Reporting System</h1>

      {/* New Post Section */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Report an Incident</h2>
        <Input.TextArea
          placeholder="Describe the incident here using markdown..."
          rows={4}
          value={newPost}
          onChange={(e) => setNewPost(e)}
          className="mb-4"
        />
        <Button type="primary" onClick={handleAddPost}>
          Submit Incident
        </Button>
      </Card>

      {/* Incident List and Replies */}
      <List
        className="bg-white shadow rounded-lg divide-y divide-gray-200"
        header={<div className="text-lg font-bold">Incident Reports</div>}
        dataSource={posts}
        render={(post: Post) => (
          <Card key={post.id} className="mb-4">
            <Comment
              author={<span className="font-semibold">{post.author}</span>}
              avatar={<Avatar size={40} src={post.avatar} />}
              datetime={<span>{post.createdAt.toLocaleString()}</span>}
              content={
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className="prose"
                >
                  {post.content}
                </ReactMarkdown>
              }
            />
            <div className="ml-10">
              {/* Render Replies */}
              {post.replies.length > 0 && (
                <List
                  header={<div className="font-bold text-sm">{post.replies.length} Replies</div>}
                  dataSource={post.replies}
                  render={(reply: Reply) => (
                    <Comment
                      key={reply.id}
                      author={<span className="font-semibold">{reply.author}</span>}
                      avatar={<Avatar size={30} src={reply.avatar} />}
                      datetime={<span>{reply.createdAt.toLocaleString()}</span>}
                      content={
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          className="prose prose-sm"
                        >
                          {reply.content}
                        </ReactMarkdown>
                      }
                    />
                  )}
                />
              )}

              {/* Add Reply Section */}
              <div className="mt-4">
                <Input.TextArea
                  placeholder="Reply to this incident..."
                  rows={3}
                  value={newReply[post.id] || ''}
                  onChange={(e) => setNewReply({ ...newReply, [post.id]: e })}
                  className="mb-2"
                />
                <Button
                  icon={<IconMessage />}
                  onClick={() => handleReply(post.id)}
                  disabled={!newReply[post.id]}
                >
                  Reply
                </Button>
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default IncidentReporting;
