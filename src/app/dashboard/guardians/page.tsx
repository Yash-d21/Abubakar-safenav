import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const guardians = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        status: 'Active',
        avatarId: 'guardian-avatar-1',
    },
    {
        name: 'Peter Jones',
        email: 'peter.jones@example.com',
        status: 'Pending',
        avatarId: 'guardian-avatar-2',
    },
];

export default function GuardiansPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold font-headline">Guardian Management</h1>
        <p className="text-muted-foreground">Add and manage your trusted contacts.</p>
       </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Guardians</CardTitle>
            <CardDescription>
              These contacts will be notified in an emergency.
            </CardDescription>
          </div>
           <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Guardian
              </span>
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guardians.map((guardian, index) => {
                 const avatar = PlaceHolderImages.find(p => p.id === guardian.avatarId);
                 return (
                    <TableRow key={index}>
                        <TableCell className="hidden sm:table-cell">
                            <Avatar className="h-9 w-9">
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={guardian.name} data-ai-hint={avatar.imageHint} />}
                                <AvatarFallback>{guardian.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{guardian.name}</TableCell>
                        <TableCell>
                            <Badge variant={guardian.status === 'Active' ? 'default': 'secondary'} className={guardian.status === 'Active' ? 'bg-green-600' : ''}>
                                {guardian.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{guardian.email}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                 );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
