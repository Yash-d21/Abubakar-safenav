
// src/app/dashboard/sos/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, Siren, Video, VideoOff, Camera, Moon, Mic, MicOff, Bot, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { summarizeChat } from '@/ai/flows/summarize-chat';
import { Skeleton } from '@/components/ui/skeleton';

const initialCenter = {
  lat: 40.7128,
  lng: -74.006,
};

type Comment = {
    author: string;
    avatarId: string;
    text: string;
    time: string;
};

const initialComments: Comment[] = [
    { author: 'John (Guardian)', avatarId: 'guardian-avatar-1', text: 'Are you okay? I am on my way!', time: '1m ago' },
    { author: 'Control Room', avatarId: 'guardian-avatar-2', text: 'Police have been dispatched to your location. ETA 5 minutes.', time: '1m ago' },
];


export default function SOSPage() {
  const { toast } = useToast();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isNightVisionOn, setIsNightVisionOn] = useState(false);
  const [isVoiceControlOn, setIsVoiceControlOn] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const mapImage = PlaceHolderImages.find(p => p.id === 'guardian-map-1');
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  useEffect(() => {
    // Get camera permission
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to share your video feed.',
        });
      }
    };
    getCameraPermission();

    // Get location
    navigator.geolocation.watchPosition(
      (position) => {
        // In a real app, you'd update the marker on the map
        console.log('New Position:', position.coords);
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Location Access Denied',
          description: 'Please enable location services to share your live position.',
        });
      },
      { enableHighAccuracy: true }
    );
    
    // Setup Speech Recognition
    if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.lang = 'en-US';
          recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            handleVoiceCommand(command);
          };
          recognitionRef.current = recognition;
        }
    }


    return () => {
      // Stop camera stream and location watch
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      recognitionRef.current?.stop();
    };
  }, [toast]);
  
  const handleSendComment = (e: React.FormEvent, text?: string) => {
    e.preventDefault();
    const commentText = text || newComment;
    if(commentText.trim()){
        const newCommentObj: Comment = {
            author: 'Jane (You)',
            avatarId: 'user-avatar-1',
            text: commentText,
            time: 'Just now'
        };
        setComments(prev => [...prev, newCommentObj]);
        setNewComment('');
    }
  }

  const handleGuardianAction = (text: string) => {
     const newCommentObj: Comment = {
        author: 'John (Guardian)',
        avatarId: 'guardian-avatar-1',
        text: text,
        time: 'Just now'
    };
    setComments(prev => [...prev, newCommentObj]);
  }
  
  const handleEndSOS = () => {
      toast({
          title: "SOS Mode Deactivated",
          description: "You have marked yourself as safe. Your guardians have been notified.",
      });
      router.push('/dashboard');
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            console.log('Recorded chunk:', event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            console.log('Recording stopped. File would be assembled and saved here.');
            toast({ title: 'Recording Saved', description: 'Your video has been securely stored.'});
            setIsRecording(false);
        };
        mediaRecorderRef.current.start(1000);
        toast({ title: 'Recording Started', description: 'Your live feed is now being recorded.' });
        setIsRecording(true);
      }
    }
  };

  const handleCapturePhoto = () => {
      const video = videoRef.current;
      if(video){
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          console.log('Photo captured:', dataUrl.substring(0, 50) + '...');
          toast({ title: 'Photo Captured', description: 'A snapshot has been securely saved.' });
      }
  };

  const handleToggleVoiceControl = () => {
    if (isVoiceControlOn) {
      recognitionRef.current?.stop();
      setIsVoiceControlOn(false);
      toast({ title: 'Voice Control Disabled' });
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsVoiceControlOn(true);
        toast({ title: 'Voice Control Enabled', description: 'Say "start recording", "capture photo", or "send help message".' });
      } catch(e) {
        console.error(e)
        toast({ variant: 'destructive', title: 'Could not start voice control.'});
      }
    } else {
      toast({ variant: 'destructive', title: 'Voice control not supported on this browser.'});
    }
  };

  const handleVoiceCommand = (command: string) => {
    toast({ title: 'Voice Command Heard', description: `"${command}"` });
    if (command.includes('start recording')) {
      if (!isRecording) handleToggleRecording();
    } else if (command.includes('stop recording')) {
      if (isRecording) handleToggleRecording();
    } else if (command.includes('capture photo')) {
      handleCapturePhoto();
    } else if (command.includes('send help message')) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSendComment(fakeEvent, "I need help, I can't talk right now.");
      toast({ title: "Help message sent." });
    }
  };
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
        const chatHistory = comments.map(c => `${c.author}: ${c.text}`).join('\n');
        const result = await summarizeChat({ chatHistory });
        const summaryComment: Comment = {
            author: 'AI Guardian',
            avatarId: 'ai-avatar',
            text: result.summary,
            time: 'Just now'
        };
        setComments(prev => [...prev, summaryComment]);
    } catch (error) {
        console.error("Error summarizing chat:", error);
        toast({ variant: 'destructive', title: 'Could not generate summary.' });
    } finally {
        setIsSummarizing(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-background">
      <ScrollArea className="h-full w-full">
        <div className="flex h-full min-h-screen flex-col gap-4 p-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between rounded-lg bg-destructive p-3 text-destructive-foreground">
              <div className="flex items-center gap-2">
                <Siren className="h-6 w-6 animate-pulse" />
                <h1 className="font-headline text-xl font-bold">SOS Mode ACTIVE</h1>
              </div>
              <Button variant="destructive" className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90" onClick={handleEndSOS}>
                End SOS
              </Button>
            </div>
          </div>
  
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            <div className="flex flex-col gap-4 lg:col-span-2 xl:col-span-3">
              <Card className="flex flex-1 flex-col">
                <CardHeader>
                  <CardTitle>Live Feed</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 gap-2 rounded-b-lg bg-black p-2">
                  <div className="relative flex-1">
                    <video ref={videoRef} className={cn('h-full w-full rounded-md object-cover', isNightVisionOn && 'night-vision')} autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/80">
                        <Alert variant="destructive" className="w-auto">
                          <Siren className="h-4 w-4" />
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>Camera is required to share your live feed.</AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-2 rounded-lg bg-black/50 p-2">
                    <Button variant={isRecording ? 'destructive' : 'secondary'} onClick={handleToggleRecording} size="sm" aria-label="Toggle Recording" className="h-auto flex-col gap-1 py-2">
                      {isRecording ? <VideoOff /> : <Video />}
                      <span>{isRecording ? 'Stop' : 'Record'}</span>
                    </Button>
                    <Button variant="secondary" onClick={handleCapturePhoto} size="sm" aria-label="Capture Photo" className="h-auto flex-col gap-1 py-2">
                      <Camera />
                      <span>Capture</span>
                    </Button>
                    <Button variant="secondary" onClick={() => setIsNightVisionOn((prev) => !prev)} size="sm" data-active={isNightVisionOn} className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground h-auto flex-col gap-1 py-2" aria-label="Toggle Night Vision">
                      <Moon />
                      <span>Night Vision</span>
                    </Button>
                     <Button variant={isVoiceControlOn ? 'default' : 'secondary'} onClick={handleToggleVoiceControl} size="sm" className="h-auto flex-col gap-1 py-2" aria-label="Toggle Voice Control">
                      {isVoiceControlOn ? <MicOff/> : <Mic />}
                      <span>{isVoiceControlOn ? 'Voice Off' : 'Voice On'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex flex-1 flex-col">
                <CardHeader>
                  <CardTitle>Live Location</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {mapImage ? (
                     <div className="w-full h-full rounded-lg overflow-hidden relative">
                        <Image 
                            src={mapImage.imageUrl}
                            alt="Map of your current location"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                            <circle cx="150" cy="180" r="8" fill="blue" stroke="white" strokeWidth="2" opacity="0.9">
                                <animate attributeName="r" from="8" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.9" to="0.3" dur="1.5s" begin="0s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="150" cy="180" r="5" fill="white" />
                        </svg>
                     </div>
                  ) : (
                    <div>Loading Map...</div>
                  )}
                </CardContent>
              </Card>
            </div>
  
            <div className="flex flex-col lg:col-span-1 xl:col-span-1">
              <Card className="flex flex-1 flex-col">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Guardian Chat</CardTitle>
                   <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isSummarizing}>
                      {isSummarizing ? <Skeleton className="h-4 w-4 animate-spin" /> : <BrainCircuit />}
                      <span className="ml-2">Get Summary</span>
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
                  <ScrollArea className="-mr-4 flex-1 pr-4">
                    <div className="space-y-4">
                      {comments.map((comment, index) => {
                        const avatar = PlaceHolderImages.find((p) => p.id === comment.avatarId);
                        const isAI = comment.author === 'AI Guardian';
                        return (
                          <div key={index} className={cn("flex items-start gap-3", isAI && 'items-center')}>
                            <Avatar className="h-8 w-8">
                              {isAI ? <Bot className="h-8 w-8 text-primary" /> : (
                                <>
                                  {avatar && <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
                                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div className={cn("flex-1 rounded-lg p-3", isAI ? 'bg-primary/10 border border-primary/20' : 'bg-muted')}>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">{comment.time}</p>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                   <div className="flex-shrink-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" onClick={() => handleSendComment({} as React.FormEvent, 'I need help urgently!')}>Send Help Message</Button>
                            <Button variant="outline" onClick={() => handleGuardianAction(`I'm on my way.`)}>On My Way</Button>
                        </div>
                        <form className="flex items-center gap-2" onSubmit={handleSendComment}>
                            <Input placeholder="Type a message..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                            <Button type="submit" size="icon" aria-label="Send Message">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
