# **Unionizer**
## Getting Started
**Prerequisites**
- git
- Node.js & npm
- Both **[workplace-unionizer-frontend](https://github.com/Tonyl3260/workplace-unionizer-frontend)** and **[workplace-unionizer-backend](https://github.com/Tonyl3260/workplace-unionizer-backend)** github repos cloned 

**Setup app and start**
1. Clone **[workplace-unionizer-frontend](https://github.com/Tonyl3260/workplace-unionizer-frontend)**
```bash
git clone git@github.com:Tonyl3260/workplace-unionizer-frontend.git
```
2. cd to **[workplace-unionizer-frontend](https://github.com/Tonyl3260/workplace-unionizer-frontend)** and install all modules needed for app, this may take a while to install
```bash
cd workplace-unionizer-frontend
npm install
```
3. After all modules have been installed, create a file named `.env.local`
```bash
touch .env.local
```
4. Edit with your chosen editor, we use gedit here but any text editor works. Paste contents from `.env.local` given and save (this will be provided)
```bash
gedit .env.local
```
5. Starting up frontend of app
```bash
npm run dev
```
6. View the app in your browser at 
[http://localhost:3000/](http://localhost:3000/)
