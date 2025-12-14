'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, MessageSquare, Pin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const communityPosts = [
    {
        id: 1,
        author: 'Concerned Citizen',
        avatarId: 'guardian-avatar-2',
        time: '5m ago',
        location: 'Oak Street Park',
        content: "Heads up everyone, the main walking path through Oak Street Park has a few streetlights out. It's pretty dark, so maybe avoid it after sunset until it's fixed. Stay safe!",
        likes: 12,
        comments: 3,
    },
    {
        id: 2,
        author: 'Local Resident',
        avatarId: 'user-avatar-1',
        time: '1h ago',
        location: 'Main & 2nd Cross',
        content: "There's a large, peaceful gathering at the corner of Main & 2nd. Traffic is a bit slow in the area but everything feels safe. Police are on site directing cars.",
        likes: 45,
        comments: 8,
    },
     {
        id: 3,
        author: 'Night Owl',
        avatarId: 'guardian-avatar-1',
        time: '3h ago',
        location: 'Central Station',
        content: "Just a reminder that the west entrance to Central Station closes at 10 PM now. Had to walk all the way around. Plan accordingly if you're traveling late!",
        likes: 22,
        comments: 5,
    }
];

export default function CommunityPage() {
    const { toast } = useToast();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const textarea = form.querySelector('textarea');
        if (textarea && textarea.value.trim() !== '') {
             toast({
                title: "Post Submitted",
                description: "Your community report has been submitted for review.",
            });
            textarea.value = '';
        }
    }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold font-headline">Community Safety Feed</h1>
        <p className="text-muted-foreground">Real-time safety updates from your local community.</p>
       </div>

       <Card>
            <CardHeader>
                <CardTitle>Share an Update</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Textarea placeholder="What's happening in your area? (e.g., poor lighting, road closures, etc.)" />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit">Post Update</Button>
                </CardFooter>
            </form>
       </Card>
      
        <div className="space-y-4">
            {communityPosts.map(post => {
                const avatar = PlaceHolderImages.find(p => p.id === post.avatarId);
                return (
                    <Card key={post.id}>
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Avatar>
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={post.author} data-ai-hint={avatar.imageHint} />}
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">{post.time}</p>
                                </div>
                                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Pin className="w-3 h-3"/>
                                    <span>{post.location}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{post.content}</p>
                        </CardContent>
                        <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <Heart className="w-4 h-4" /> {post.likes}
                            </Button>
                             <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" /> {post.comments}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    </div>
  );
}
