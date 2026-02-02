# RemindMeBot Demo

Interactive prototype for RemindMeBot - a WhatsApp-based personal assistant for document management and deadline reminders.

![RemindMeBot](https://img.shields.io/badge/Status-Prototype-green)

## 🚀 Features

- **WhatsApp Bot Simulator** - Interactive chat interface demonstrating bot conversations
- **Web Dashboard** - Manage reminders and documents
- **Split View** - See both interfaces side-by-side

## 📦 Quick Start

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production
```bash
npm run build
```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import this GitHub repository
4. Deploy!

### Custom Domain Setup
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your subdomain (e.g., `demo.yourdomain.com`)
3. Update DNS: Add CNAME record pointing to `cname.vercel-dns.com`

## 🌐 Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `dist` folder (after running `npm run build`)
3. Or connect this GitHub repo for auto-deploys

### Custom Domain on Netlify
1. Site Settings → Domain Management → Add custom domain
2. Add DNS record as instructed

## 📁 Project Structure

```
remindmebot-demo/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main prototype component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📱 Demo Scenarios

Try these commands in the WhatsApp simulator:

1. `Remind me when my passport expires on 15 Aug 2026`
2. `Show my reminders`
3. `Send me my passport`
4. `Email my passport to hr@company.com`
5. `Upload my Emirates ID`

## 📄 License

Proprietary - For demonstration purposes only.

---

Built with ❤️ for the RemindMeBot pitch
