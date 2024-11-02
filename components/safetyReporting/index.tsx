// IncidentReporting.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  Comment, 
  Avatar, 
  List,
  Message,
  Spin
} from '@arco-design/web-react';
import { 
  IconMessage, 
  IconLoading
} from '@arco-design/web-react/icon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import App from "@/app/(site)/api/api";

interface Reply {
  id: string;
  author: string;
  content: string;
  avatar: string;
  created_at: string;
}

interface Post {
  id: string;
  author: string;
  content: string;
  avatar: string;
  replies: Reply[];
  created_at: string;
}

const TextArea = Input.TextArea;

const IncidentReporting: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await App.get('/api/incidents/');
      setPosts(response.data);
    } catch (err) {
      Message.error('Failed to load incidents. Please try again later.');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.trim() || submitting) return;

    try {
      setSubmitting(true);
      const post = {
        author: 'John Doe', // Replace with actual user data
        content: newPost,
      };
      const response = await App.post('/api/incidents/', post);
      setPosts([response.data, ...posts]);
      setNewPost('');
      Message.success('Incident reported successfully');
    } catch (err) {
      Message.error('Failed to submit incident. Please try again.');
      console.error('Error adding post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!newReply[postId]?.trim() || replySubmitting[postId]) return;

    try {
        setReplySubmitting(prev => ({ ...prev, [postId]: true }));
        const reply = {
            incident_id: postId,  // Changed from 'incident' to 'incident_id'
            author: 'Jane Doe',
            content: newReply[postId],
        };
        const response = await App.post('/api/reply-incident/', reply);
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    replies: [...post.replies, response.data]
                };
            }
            return post;
        }));
        setNewReply(prev => ({ ...prev, [postId]: '' }));
        Message.success('Reply added successfully');
    } catch (err) {
        Message.error('Failed to submit reply. Please try again.');
        console.error('Error adding reply:', err);
    } finally {
        setReplySubmitting(prev => ({ ...prev, [postId]: false }));
    }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin dot />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Reporting System</h1>

      {/* New Post Section */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Report an Incident</h2>
        <TextArea
          placeholder="Describe the incident here using markdown..."
          style={{ marginBottom: 16 }}
          rows={4}
          value={newPost}
          onChange={setNewPost}
        />
        <Button
          type="primary"
          onClick={handleAddPost}
          loading={submitting}
          icon={<IconMessage />}
        >
          Submit Incident
        </Button>
      </Card>

      {/* Incident List and Replies */}
      <List
        className="incident-list"
        header={<div className="text-lg font-semibold">Incident Reports</div>}
        dataSource={posts}
        render={(post: Post) => (
          <Card key={post.id} className="mb-4">
            <Comment
              author={<span className="font-semibold">{post.author}</span>}
              content={
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className="prose"
                >
                  {post.content}
                </ReactMarkdown>
              }
              datetime={formatDate(post.created_at)}
              avatar={
                <Avatar size={40}>
                  <img alt={post.author} src="https://github.com/gilbertketer.png" />
                </Avatar>
              }
            />
            
            <div className="ml-10 mt-4">
              {/* Replies Section */}
              {post.replies.length > 0 && (
                <List
                  className="replies-list"
                  header={<div className="font-semibold text-sm">{post.replies.length} Replies</div>}
                  dataSource={post.replies}
                  render={(reply: Reply) => (
                    <Comment
                      key={reply.id}
                      author={<span className="font-semibold">{reply.author}</span>}
                      content={
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          className="prose prose-sm"
                        >
                          {reply.content}
                        </ReactMarkdown>
                      }
                      datetime={formatDate(reply.created_at)}
                      avatar={
                        <Avatar size={32}>
                          <img alt={reply.author} src="https://github.com/gilbertketer.png" />
                        </Avatar>
                      }
                    />
                  )}
                />
              )}

              {/* Add Reply Section */}
              <div className="mt-4">
                <TextArea
                  placeholder="Reply to this incident..."
                  style={{ marginBottom: 8 }}
                  rows={3}
                  value={newReply[post.id] || ''}
                  onChange={(value) => setNewReply({ ...newReply, [post.id]: value })}
                />
                <Button
                  type="primary"
                  icon={<IconMessage />}
                  onClick={() => handleReply(post.id)}
                  loading={replySubmitting[post.id]}
                  disabled={!newReply[post.id]?.trim()}
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