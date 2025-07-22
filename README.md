
# 🚀 Devfolio – Dynamic API-Powered Portfolio for Developers

> **Easily manage your portfolio projects, blogs, and useful links through a simple dashboard with ready-to-use APIs. Perfect for ML Engineers, Developers, and Students.**

---

## 📢 About Devfolio

**Devfolio** is a platform designed for developers who don’t want to waste time rebuilding portfolios again and again.  
Instead, you manage your content through a simple admin panel and get ready-to-use APIs for your static sites.

### 🔥 What Problem Does It Solve?
- Developers struggle to update static portfolios.
- ML engineers / backend devs don’t want to write React every time.
- No more copy-pasting links or updating code for small changes.

---

## ✨ Key Features
- 🔐 Admin Dashboard (with Authentication)
- 📂 Add / Edit / Delete Projects, Blogs, and Useful Links
- 🌐 Auto-generated APIs for integration:
  - `/api/{username}/projects`
  - `/api/{username}/blogs`
  - `/api/{username}/links`
- 📊 Basic Analytics (Visitors Count, Project Views)
- 🔗 Public Profile Pages like `/username`
- 🚀 Easy integration with Next.js / React static sites

---

## 📂 Project Structure
```
/pages
  /api
    /projects
    /blogs
    /links
  /admin
  /[username]
/components
/utils
/styles
```

---

## 🛠 Tech Stack
- **Next.js 14 (App Router)**
- **Tailwind CSS**
- **MongoDB** (Mongoose)
- **JWT Authentication**
- **REST APIs**
- **TypeScript (optional)**

---

## 📥 Getting Started Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/devfolio.git
cd devfolio
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup environment variables
Create `.env.local`
```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
BASE_URL=http://localhost:3000
```

### 4️⃣ Run the project
```bash
npm run dev
```

---

## 📄 Example API Response
### `GET /api/mrravipandey/projects`
```json
[
  {
    "title": "AI Content Generator",
    "description": "Generate SEO-optimized content automatically.",
    "tech": ["Next.js", "AI API", "Tailwind CSS"],
    "github": "https://github.com/...",
    "live": "https://ai-content.xyz",
    "image": "https://example.com/image.png"
  }
]
```

---

## 📊 Future Roadmap
- OAuth Login (GitHub, Google)
- Custom Subdomains: `username.xyz.in`
- Advanced Analytics
- Templates for Instant Portfolio Setup
- Dark/Light Mode

---

## 💡 Why Use Devfolio?
| For         | What It Solves            |
|-------------|----------------------------|
| ML Engineers | Share projects dynamically, no frontend needed |
| Students    | Easy to maintain project lists for placements  |
| Developers  | Focus on tech, not updating static files |

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License
[MIT License](LICENSE)

---

## 🙌 Author
**Ravi Pandey**  
[Portfolio](https://imravidev.vercel.app) • [LinkedIn](https://linkedin.com/in/mrravipandee/) • [GitHub](https://github.com/mrravipandee)
