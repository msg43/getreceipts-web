'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  author: string;
  voteScore: number;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  claimId: string;
  initialComments?: Comment[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CommentsSection({ claimId: _claimId, initialComments = [] }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call - in production this would hit a real endpoint
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: 'Anonymous User', // In production, get from auth
        voteScore: 0,
        createdAt: new Date().toISOString(),
      };
      
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const reply: Comment = {
        id: `reply-${Date.now()}`,
        content: replyText,
        author: 'Anonymous User',
        voteScore: 0,
        createdAt: new Date().toISOString(),
        parentId
      };
      
      setComments([...comments, reply]);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVoteComment = async (commentId: string, voteType: 'up' | 'down') => {
    // Simulate voting on comments
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, voteScore: comment.voteScore + (voteType === 'up' ? 1 : -1) }
        : comment
    ));
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Separate top-level comments from replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const replies = comments.filter(c => c.parentId);
  
  const getCommentReplies = (commentId: string) => {
    return replies.filter(r => r.parentId === commentId);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          💬 Discussion
          <Badge variant="secondary">{comments.length} comments</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Comment Form */}
        <div className="space-y-2">
          <Textarea
            placeholder="Share your thoughts on this claim..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
        
        {/* Comments List */}
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Main Comment */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{comment.author[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-slate-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteComment(comment.id, 'up')}
                          className="h-6 px-2"
                        >
                          ↑
                        </Button>
                        <span className="text-xs font-medium">{comment.voteScore}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoteComment(comment.id, 'down')}
                          className="h-6 px-2"
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="ml-8 space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText.trim() || isSubmitting}
                        size="sm"
                      >
                        Reply
                      </Button>
                      <Button 
                        onClick={() => setReplyingTo(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Replies */}
                {getCommentReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="ml-8 border-l-2 border-slate-200 pl-4">
                    <div className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{reply.author[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{reply.author}</span>
                            <span className="text-xs text-slate-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoteComment(reply.id, 'up')}
                              className="h-5 px-1 text-xs"
                            >
                              ↑
                            </Button>
                            <span className="text-xs">{reply.voteScore}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoteComment(reply.id, 'down')}
                              className="h-5 px-1 text-xs"
                            >
                              ↓
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
