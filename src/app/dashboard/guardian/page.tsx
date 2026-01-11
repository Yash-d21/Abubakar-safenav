
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AlertTriangle, Map, Phone, ShieldCheck, Battery, Car } from 'lucide-react';
import Link from 'next/link';
import { MapCard } from '@/components/dashboard/map-card';

const protectedUsers = [
    {
        name: 'Jane Doe',
        status: 'SOS Active',
        lastSeen: '123 Safe St, New York, NY',
        avatarId: 'user-avatar-1',
        mapId: 'guardian-map-1',
        battery: 23,
        rideDetails: 'Uber: Honda CRV - UZ-456-NY'
    },
    {
        name: 'Emily Smith',
        status: 'Safe',
        lastSeen: '800 Secure Ave, New York, NY',
        avatarId: 'protected-user-2',
        mapId: '',
        battery: 87,
        rideDetails: 'Not in a ride'
    }
];

export default function GuardianDashboard() {
  const sosUser = protectedUsers.find(u => u.status === 'SOS Active');
  
  const getBatteryColor = (level: number) => {
    if (level <= 25) return 'text-destructive';
    if (level <= 50) return 'text-yellow-500';
    return 'text-green-500';
  }

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
             <Card className={sosUser ? "border-destructive" : ""}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${sosUser ? 'text-destructive' : ''}`}>
                        {sosUser && <AlertTriangle className="h-6 w-6 animate-pulse" />}
                        {sosUser ? 'Active SOS Event' : 'No Active Events'}
                    </CardTitle>
                    <CardDescription>
                        {sosUser ? `${sosUser.name} has activated their SOS. Their live information is now available.` : 'All your connections are currently safe.'}
                    </CardDescription>
                </CardHeader>
                {sosUser && (
                    <CardContent className="space-y-4">
                       <div className="relative">
                            <MapCard onFindRoute={() => {}} />
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                                <circle cx="200" cy="150" r="8" fill="green" stroke="white" strokeWidth="2" opacity="0.9">
                                    <animate attributeName="r" from="8" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.9" to="0.3" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="200" cy="150" r="5" fill="white" />
                            </svg>
                        </div>
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-lg">{sosUser.name}'s Status</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <Battery className={`h-5 w-5 ${getBatteryColor(sosUser.battery)}`} />
                                    <span className="font-medium">{sosUser.battery}%</span>
                                    <span className="text-muted-foreground">Phone Battery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Car className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">{sosUser.rideDetails}</span>
                                </div>
                            </CardContent>
                        </Card>
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
                    </CardContent>
                )}
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
                    <div className="space-y-2">
                        {protectedUsers.map(user => {
                            const avatar = PlaceHolderImages.find(p => p.id === user.avatarId);
                            return (
                                <div key={user.name} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                                    <Avatar>
                                        {avatar && <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{user.name}</p>
                                             <Badge variant={user.status === 'SOS Active' ? 'destructive' : 'secondary'} className={user.status === 'Safe' ? 'bg-green-100 text-green-800' : ''}>
                                                {user.status === 'SOS Active' ? <AlertTriangle className="mr-1 h-3 w-3" /> : <ShieldCheck className="mr-1 h-3 w-3" />}
                                                {user.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{user.lastSeen}</p>
                                        <div className='flex items-center gap-4 mt-1'>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Battery className={`h-3 w-3 ${getBatteryColor(user.battery)}`} />
                                                <span>{user.battery}%</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Car className="h-3 w-3" />
                                                <span>{user.rideDetails}</span>
                                            </div>
                                        </div>
                                    </div>
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
