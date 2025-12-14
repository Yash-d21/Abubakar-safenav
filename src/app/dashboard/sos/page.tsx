// src/app/dashboard/sos/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, Siren, Video, VideoOff, Camera, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(initialCenter);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isNightVisionOn, setIsNightVisionOn] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

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
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          variant: 'destructive',
          title: 'Location Access Denied',
          description: 'Please enable location services to share your live position.',
        });
      },
      { enableHighAccuracy: true }
    );
    
    return () => {
      // Stop camera stream and location watch
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      navigator.geolocation.clearWatch(watchId);
    };
  }, [toast]);
  
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if(newComment.trim()){
        const newCommentObj: Comment = {
            author: 'Jane (You)',
            avatarId: 'user-avatar-1',
            text: newComment,
            time: 'Just now'
        };
        setComments(prev => [...prev, newCommentObj]);
        setNewComment('');
    }
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
            // In a real app, you would upload these chunks to a server
            console.log('Recorded chunk:', event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            console.log('Recording stopped. File would be assembled and saved here.');
            toast({ title: 'Recording Saved', description: 'Your video has been securely stored.'});
            setIsRecording(false);
        };
        mediaRecorderRef.current.start(1000); // Fire ondataavailable every second
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
          // In a real app, you'd upload this dataUrl to a server.
          console.log('Photo captured:', dataUrl.substring(0, 50) + '...');
          toast({ title: 'Photo Captured', description: 'A snapshot has been securely saved.' });
      }
  };


  return (
    <div className="fixed inset-0 z-50 flex h-screen flex-col bg-background p-4 gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between bg-destructive text-destructive-foreground p-3 rounded-lg">
              <div className="flex items-center gap-2">
                  <Siren className="w-6 h-6 animate-pulse" />
                  <h1 className="text-xl font-bold font-headline">SOS Mode ACTIVE</h1>
              </div>
              <Button variant="destructive" className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90" onClick={handleEndSOS}>End SOS</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Left Column: Video and Map */}
            <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0">
                <Card className="flex-1 flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle>Live Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex gap-4 bg-black rounded-b-lg p-2">
                       <div className="flex-1 relative">
                          <video ref={videoRef} className={cn("w-full h-full object-cover rounded-md", isNightVisionOn && 'night-vision')} autoPlay muted playsInline />
                          {hasCameraPermission === false && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-md">
                                  <Alert variant="destructive" className="w-auto">
                                        <Siren className="h-4 w-4"/>
                                        <AlertTitle>Camera Access Required</AlertTitle>
                                        <AlertDescription>
                                          Camera is required to share your live feed.
                                        </AlertDescription>
                                </Alert>
                              </div>
                          )}
                       </div>
                       <div className="flex flex-col justify-center gap-2 bg-black/50 p-2 rounded-lg">
                            <Button variant={isRecording ? "destructive" : "secondary"} onClick={handleToggleRecording} size="sm" aria-label="Toggle Recording" className="flex-col h-auto py-2 gap-1">
                                {isRecording ? <VideoOff/> : <Video />}
                                <span>{isRecording ? 'Stop' : 'Record'}</span>
                            </Button>
                            <Button variant="secondary" onClick={handleCapturePhoto} size="sm" aria-label="Capture Photo" className="flex-col h-auto py-2 gap-1">
                                <Camera />
                                <span>Capture</span>
                            </Button>
                            <Button variant="secondary" onClick={() => setIsNightVisionOn(prev => !prev)} size="sm" data-active={isNightVisionOn} className="flex-col h-auto py-2 gap-1 data-[active=true]:bg-green-600 data-[active=true]:text-white" aria-label="Toggle Night Vision">
                                <Moon/>
                                <span>Night Vision</span>
                            </Button>
                       </div>
                    </CardContent>
                </Card>
                <Card className="flex-1 flex flex-col min-h-0">
                     <CardHeader>
                        <CardTitle>Live Location</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {isLoaded ? (
                            <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} zoom={16}>
                                <Marker position={currentLocation} />
                            </GoogleMap>
                        ) : <div>Loading Map...</div>}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Chat */}
            <div className="lg:col-span-1 flex flex-col min-h-0">
                 <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Guardian Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                             <div className="space-y-4">
                                {comments.map((comment, index) => {
                                    const avatar = PlaceHolderImages.find(p => p.id === comment.avatarId);
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <Avatar className="w-8 h-8">
                                                {avatar && <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
                                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-muted p-3 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-sm">{comment.author}</p>
                                                    <p className="text-xs text-muted-foreground">{comment.time}</p>
                                                </div>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                             </div>
                        </ScrollArea>
                        <form className="flex-shrink-0 flex items-center gap-2" onSubmit={handleSendComment}>
                            <Input placeholder="Type a message..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                            <Button type="submit" size="icon" aria-label="Send Message">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
