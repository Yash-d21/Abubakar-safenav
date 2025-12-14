import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your account and notification preferences.</p>
       </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is how others will see you on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Jane Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Profile</Button>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="red-zone-entry" defaultChecked />
                    <Label htmlFor="red-zone-entry">Entering a Red Zone</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="guardian-alerts" defaultChecked />
                    <Label htmlFor="guardian-alerts">Guardian Emergency Alerts</Label>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="alert-sound">Alert Sound</Label>
                    <Select defaultValue="siren">
                        <SelectTrigger id="alert-sound">
                            <SelectValue placeholder="Select sound" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="siren">Siren</SelectItem>
                            <SelectItem value="beep">Beep</SelectItem>
                            <SelectItem value="chime">Chime</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Preferences</Button>
            </CardFooter>
        </Card>
         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Personalized Risk Profile</CardTitle>
                <CardDescription>Influence how your routes are calculated based on your risk tolerance.</CardDescription>
            </CardHeader>
            <CardContent>
                 <RadioGroup defaultValue="balanced" className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced" className="font-normal">
                           <span className="font-semibold">Balanced (Recommended)</span>
                           <p className="text-xs text-muted-foreground">Prioritizes a mix of speed and safety, avoiding only high-risk zones.</p>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="max-safety" id="max-safety" />
                         <Label htmlFor="max-safety" className="font-normal">
                           <span className="font-semibold">Maximum Safety</span>
                           <p className="text-xs text-muted-foreground">Avoids all potential risk zones, even if it means a significantly longer route.</p>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button>Save Risk Profile</Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}
