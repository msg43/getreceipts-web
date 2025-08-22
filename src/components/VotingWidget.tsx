'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface VoteData {
  upvotes: number;
  downvotes: number;
  credible: number;
  not_credible: number;
}

interface VotingWidgetProps {
  claimId: string;
  initialVotes: VoteData;
  userVote?: string | null;
  disabled?: boolean;
}

export default function VotingWidget({ 
  claimId, 
  initialVotes, 
  userVote: initialUserVote = null,
  disabled = false 
}: VotingWidgetProps) {
  const [votes, setVotes] = useState<VoteData>(initialVotes);
  const [userVote, setUserVote] = useState<string | null>(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async (voteType: 'up' | 'down' | 'credible' | 'not_credible') => {
    if (disabled || isVoting) return;
    
    try {
      setIsVoting(true);
      
      // Simulate API call for now - in production this would hit a real endpoint
      const response = await fetch(`/api/claims/${claimId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_type: voteType })
      });
      
      if (response.ok) {
        const newVotes = await response.json();
        setVotes(newVotes);
        setUserVote(voteType);
      } else {
        // For demo purposes, simulate the vote
        const newVotes = { ...votes };
        if (userVote) {
          // Remove previous vote
          (newVotes as any)[userVote] = Math.max(0, (newVotes as any)[userVote] - 1);
        }
        // Add new vote
        (newVotes as any)[voteType] = (newVotes as any)[voteType] + 1;
        setVotes(newVotes);
        setUserVote(voteType);
      }
    } catch (error) {
      console.error('Error voting:', error);
      // For demo purposes, still update the UI
      const newVotes = { ...votes };
      if (userVote) {
        (newVotes as any)[userVote] = Math.max(0, (newVotes as any)[userVote] - 1);
      }
      (newVotes as any)[voteType] = (newVotes as any)[voteType] + 1;
      setVotes(newVotes);
      setUserVote(voteType);
    } finally {
      setIsVoting(false);
    }
  };
  
  const getButtonVariant = (voteType: string) => {
    return userVote === voteType ? 'default' : 'outline';
  };
  
  const getButtonClass = (voteType: string) => {
    if (userVote === voteType) {
      const colors: Record<string, string> = {
        'up': 'bg-green-500 hover:bg-green-600',
        'down': 'bg-red-500 hover:bg-red-600',
        'credible': 'bg-blue-500 hover:bg-blue-600',
        'not_credible': 'bg-orange-500 hover:bg-orange-600'
      };
      return colors[voteType] || '';
    }
    return '';
  };
  
  if (disabled) {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="text-center text-gray-500">
            <p className="text-sm mb-2">Community Feedback</p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline">↑ {votes.upvotes}</Badge>
              <Badge variant="outline">↓ {votes.downvotes}</Badge>
              <Badge variant="outline">Credible {votes.credible}</Badge>
              <Badge variant="outline">Disputed {votes.not_credible}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-medium mb-3">Rate this claim</p>
            
            <div className="flex justify-center gap-2 mb-4">
              <Button 
                variant={getButtonVariant('up')}
                size="sm"
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={getButtonClass('up')}
              >
                ↑ {votes.upvotes}
              </Button>
              <Button 
                variant={getButtonVariant('down')}
                size="sm"
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={getButtonClass('down')}
              >
                ↓ {votes.downvotes}
              </Button>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button 
                variant={getButtonVariant('credible')}
                size="sm"
                onClick={() => handleVote('credible')}
                disabled={isVoting}
                className={getButtonClass('credible')}
              >
                Credible {votes.credible}
              </Button>
              <Button 
                variant={getButtonVariant('not_credible')}
                size="sm"
                onClick={() => handleVote('not_credible')}
                disabled={isVoting}
                className={getButtonClass('not_credible')}
              >
                Disputed {votes.not_credible}
              </Button>
            </div>
          </div>
          
          {userVote && (
            <p className="text-xs text-center text-gray-500">
              You voted: {userVote.replace('_', ' ')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
