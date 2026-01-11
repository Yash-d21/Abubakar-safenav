'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AlertTriangle, Map, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { MapCard } from '@/components/dashboard/map-card';

const protectedUsers = [
    {
        name: 'Jane Doe',
        status: 'SOS Active',
        lastSeen: '123 Safe St, New York, NY',
        avatarId: 'user-avatar-1',
        mapId: 'guardian-map-1'
    },
    {
        name: 'Emily Smith',
        status: 'Safe',
        lastSeen: '800 Secure Ave, New York, NY',
        avatarId: 'protected-user-2',
        mapId: ''
    }
];

export default function GuardianDashboard() {
  const sosUser = protectedUsers.find(u => u.status === 'SOS Active');
  const safeUsers = protectedUsers.filter(u => u.status !== 'SOS Active');
  
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-6 w-6 animate-pulse" />
                        Active SOS Event
                    </CardTitle>
                    <CardDescription>
                        {sosUser?.name} has activated their SOS. Their live location is now available.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sosUser ? (
                        <>
                            <MapCard onFindRoute={() => {}} />
                            <div className="flex flex-wrap gap-2">
                                <Link href="/dashboard/sos" className="flex-1">
                                    <Button className="w-full">
                                        <Map className="mr-2" /> View Live Feed & Chat
                                    </Button>
                                </Link>
                                <Button variant="secondary" className="flex-1">
                                    <Phone className="mr-2" /> Call {sosUser.name}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No active SOS events.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 grid auto-rows-max items-start gap-4 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Your Connections</CardTitle>
                    <CardDescription>
                        The safety status of the users you are protecting.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {protectedUsers.map(user => {
                            const avatar = PlaceHolderImages.find(p => p.id === user.avatarId);
                            return (
                                <div key={user.name} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                                    <Avatar>
                                        {avatar && <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.lastSeen}</p>
                                    </div>
                                    <Badge variant={user.status === 'SOS Active' ? 'destructive' : 'secondary'} className={user.status === 'Safe' ? 'bg-green-100 text-green-800' : ''}>
                                        {user.status === 'SOS Active' ? <AlertTriangle className="mr-1 h-3 w-3" /> : <ShieldCheck className="mr-1 h-3 w-3" />}
                                        {user.status}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
