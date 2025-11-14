```

███████╗██╗  ██╗██╗██╗     ███████╗ ██████╗ ██████╗ ███████╗  
██╔════╝██║  ██║██║██║     ██╔════╝██╔════╝██╔═══██╗██╔════╝  
███████╗███████║██║██║     █████╗  ██║     ██║   ██║███████╗  
╚════██║██╔══██║██║██║     ██╔══╝  ██║     ██║   ██║╚════██║  
███████║██║  ██║██║███████╗███████║╚██████╗╚██████╔╝███████║  
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝

```

# SkillForge
AI-Powered Resume Analysis & Skill Mapping Platform

---

## 🚀 Overview
SkillForge is a full-stack project that allows users to upload resumes, processes them on a Node.js backend, and visualizes skills using dynamic React-based charts.  
The project is built with React, Node.js/Express, and deployed using AWS.

---

## 🧩 Features
• Resume upload & processing  
• Skill radar and line graphs  
• Responsive UI with smooth animations  
• Particle background effects  
• Backend API for file handling  

---

## 🛠 Tech Stack

Frontend: React.js, Recharts, CSS  
Backend: Node.js, Express.js, Multer  
Deployment: EC2, PM2, NGINX  

---

## 📁 Folder Structure

skillforge/  
├── backend/  
│   ├── server.js  
│   ├── uploads/  
│   └── package.json  
│  
├── public/  
│   ├── index.html  
│   ├── favicon.ico  
│   └── manifest.json  
│  
├── src/  
│   ├── Assets/  
│   ├── components/  
│   │   ├── UploadResume/  
│   │   └── Particle Background/  
│   ├── pages/  
│   │   ├── Home/  
│   │   └── Analysis/  
│   ├── App.jsx  
│   └── index.js  
│  
├── package.json  
└── README.md  

---

## ⚙️ Installation

### Frontend
npm install  
npm start  
(localhost:3000)

### Backend
cd backend  
npm install  
node server.js  
(localhost:4000)

---

## 🧪 API (Example)

POST /upload  
• multipart/form-data  
• field name: resume  

Response:  
{ "message": "File uploaded successfully", "filename": "resume.pdf" }

---

## ☁️ AWS Deployment

### Frontend (S3 + CloudFront)
1. npm run build  
2. Upload /build to S3  
3. Enable static hosting  
4. Create CloudFront distribution  
5. Set index.html as default root  

### Backend (EC2 + PM2 + NGINX)
1. Launch Ubuntu EC2  
2. Install Node, npm, nginx, pm2  
3. Upload backend folder  
4. pm2 start server.js  
5. Configure NGINX reverse proxy to localhost:5000  
6. Restart nginx  

---

## 🖼 Screenshots 
![Home](screenshots/home.png)  
![Analysis](screenshots/analysis.png)

---

## 👨‍💻 Author

**Priyanshu Mishra**  
Full-stack developer with 4 years of experience building and deploying scalable web and mobile applications.  
Proficient in Node.js, React.js, AWS (EC2, S3), Socket.io, BullMQ.  
Experienced with Google Play Console & Apple Developer Console.  
Known for fast learning, problem-solving, and delivering end-to-end solutions.

---

## ⭐ Contributing
PRs are welcome.

---

## 📝 License
MIT © 2025 Priyanshu Mishra
