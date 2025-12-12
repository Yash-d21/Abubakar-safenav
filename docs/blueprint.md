# **App Name**: SafeNav

## Core Features:

- Dynamic Red Zone AI Engine: Aggregates data from various sources and uses the Gemini API to generate a real-time 'Red Zone' safety score for street segments, stored in Firestore.
- Intelligent Safety Routing: Uses the Google Maps Routes API and 'Red Zone' safety scores to calculate the safest route to a destination, even if it's slightly longer.  Allows visualization of risk via overlaid 'Red Zones'.
- Emergency Response and Geofencing: Utilizes the user's location and 'Red Zone' boundaries to send instant push notifications via FCM to the user and emergency contacts when the user enters a 'Red Zone'.
- Non-Response Emergency Escalation: When an emergency contact calls or the user triggers an alert, a timer starts. If the user doesn't confirm their safety before the timer expires, the app notifies public authorities via API.
- Hands-Free Emergency Activation: On-device ML model continuously analyzes microphone input for distress patterns and uses device sensors as a tool to confirm the trigger, drastically reducing false positives.
- Dual-Role Access and Guardian Oversight: Users can assign 'guardian' roles to trusted contacts.  Guardians can only access live location and alert data when an emergency is active, ensuring privacy.
- Secure Authentication and Storage: Secure user management using Firebase Authentication and encrypted data storage in Firestore. Includes Firebase App Check for app integrity and a scalable backend using Firebase Cloud Functions.

## Style Guidelines:

- Primary color: Deep calming blue (#3F51B5) to inspire trust and security.
- Background color: Very light desaturated blue (#E8EAF6), for a calm and unobtrusive feel.
- Accent color: A vibrant, attention-getting orange (#FF9800), to highlight the call to action, particularly the emergency alert and 'I'm Safe' button.
- Body and headline font: 'Inter' sans-serif font for a modern, machined, objective, neutral look; suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clear, universally understood icons for navigation and alerts, such as location markers, sirens, and checkmarks.
- Use subtle animations to indicate real-time updates and alerts, but avoid distracting or alarming animations.