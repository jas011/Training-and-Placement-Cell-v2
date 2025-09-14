
# Training & Placement Cell V2

A full-stack web application built with **Next.js (App Router)**, **Prisma**, and **MongoDB (Atlas)**.  
This project is part of the **TNP Technical Recruitment Task**.  

---

## 🚀 Features

- **Home Page (`/home`)**
  - Infinite scroll for browsing posts
  - Filters by category/branch (CSE, IT, CE, EE, ECE, MBA, etc.)
  - Filters by type (Hackathon, Placement, Internship, Event, Other)
  - Search bar (searches title, date, announcement type)
  - Sorted by updated time (ascending)

- **Post Page (`/post/[slug]`)**
  - Full post view
  - CSV upload support → view + download
  - Edit & Delete buttons

- **Create Post (`/dashboard/editor/create-post`)**
  - Rich text editor (Lexical-based)
  - File upload support
  - Post preview before publishing

- **Edit Post (`/dashboard/editor/edit/[slug]`)**
  - Modify existing posts
  - Save changes in database

- **Dashboard (`/dashboard`)**
  - Lists posts created by the logged-in user
  - Edit & Delete options

- **Contact Page (`/contact`)**

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) with TypeScript  
- **Styling**: Tailwind CSS + Shadcn/UI Components  
- **Backend**: Next.js API Routes  
- **Database**: MongoDB Atlas (free M0 cluster)  
- **ORM**: Prisma  
- **Deployment**: Vercel  

---

## 📂 Project Structure

```

app/
├─ (T\&P)/
│   ├─ contact/         # Contact page
│   ├─ home/            # Home page
├   └─ post/\[slug]/    # Dynamic post detail page
├─ api/
│   ├─ page/            # Page count API
│   ├─ postCount/       # Post counter API
│   └─ posts/
│       ├─ \[id]/route.ts  # GET, PUT, PATCH, DELETE post by ID
│       └─ route.ts       # CRUD endpoints for posts
├─ users/               # User API
├─ dashboard/           # Dashboard for managing posts
    └─ editor/          # Post editor (create/edit)

````

---

## ⚙️ Environment Variables

Create a `.env.local` file in your project root:

```env
MONGODB_URI="mongodb://127.0.0.1:27017/TNP"
````

> ⚠️ Replace `<username>` and `<password>` with your MongoDB Atlas credentials.
> Ensure the DB name is `TNP` (or update schema accordingly).

---

## 🔧 Prisma Setup

1. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

2. Push schema to database:

   ```bash
   npx prisma db push
   ```

3. Example `Post` model (from `schema.prisma`):

   ```prisma
   model Post {
    id               String   @id @map("_id")
    title            String
    status           String // Draft or Active  
    announcementType String //  "announcement" 
    selectedBranches String[] //e.g. MBA or BBA 
    doc              String // compressed Lexical string
    preview          String // trimmed preview text
    csvData          Json[]
    fileName         String
    author           User     @relation("UserPosts", fields: [authorId], references: [id])
    authorId         String   @db.ObjectId
    createdAt        DateTime @default(now())
    updatedAt        DateTime @updatedAt

    @@index([title]) // index on title
    @@index([createdAt]) // index on createdAt
    @@index([status]) // index on status
   }
   ```

---

## 🖥️ Running Locally

1. Clone repo:

   ```bash
   git clone https://github.com/yourusername/Training-and-Placement-Cell-v2.git
   cd Training-and-Placement-Cell-v2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start dev server:

   ```bash
   npm run dev
   ```

4. Visit:

   ```
   http://localhost:3000
   ```

---

## 🚀 Deployment

Deployed on **Vercel**.

* Build command:

  ```bash
  prisma generate && next build
  ```
* Env vars configured via Vercel dashboard.

---

## 🔮 Future Improvements

* User authentication & role-based access (e.g., admin, student)
* Notifications for new posts
* File uploads (images, PDFs) with cloud storage (e.g., S3, Cloudinary)
* Analytics dashboard for TNP team

---

## 📞 Contact

* Built by: Jaskirat Singh
* For TNP Technical Recruitment 2025


