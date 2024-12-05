## Client
1. Install all modules needed for the client
```bash
npm install
```
2. After all modules have been installed, create a file named `.env.local`
```bash
touch .env.local
```
3. You will need to create a firebase account to use this project. 

- Go to [Google Firebase](https://firebase.google.com/)  
- Click on 'Go to Console' in the upper right corner
- Click on 'Create a Project' and fill out the following information
- Any name for the project, Default settings for everything else. If the site requires you to create a "Google Analytics account", create an account and follow through with default settings. 
- On the dashboard, click on the web app circle to create a webapp, you can enter any app name for this and register this app.
4. Edit with your chosen editor, we use gedit here but any text editor works. Replace with what you have on Firebase and save 
```bash
gedit .env.local
```
```
NEXT_PUBLIC_FIREBASE_API_KEY= **apiKey**
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= **authDomain**
NEXT_PUBLIC_FIREBASE_PROJECT_ID= **projectId**
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= **storageBucket**
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= **messagingSenderId**
NEXT_PUBLIC_FIREBASE_APP_ID= **appId**
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID= **measurementId**
NEXT_PUBLIC_ENCRYPTION_PORT=http://34.207.155.52:5000
NEXT_PUBLIC_BACKEND_PORT=5000
```
5. Starting up frontend of app
```bash
npm run dev
```
6. View the app in your browser at 
[http://localhost:3000/](http://localhost:3000/)
