# JDReady

Upload your resume and a job description, and get an instant match score, the skills you're missing, and what to fix — plus a resume builder, tailored cover letters, mock interview practice, and side-by-side job comparisons, all saved to your account.

---

## Features

- 🔐 **Authentication** — signup, login, logout via NextAuth (Credentials provider), plus forgot/reset password by email
- 📄 **Resume analysis** — upload a resume (.pdf/.docx) and a job description, get an AI-scored match with matched skills, missing skills, and concrete suggestions
- 📊 **Compare multiple jobs** — paste several job descriptions at once and see, ranked, which role your resume fits best
- 🧱 **ATS-friendly resume builder** — no resume yet? Build one with a guided form, pick from multiple templates (Minimal, Modern, Compact), and export a clean, single-column PDF that parses reliably
- 🧩 **Generate from a job description** — paste a JD and the skills you already know, get a tailored summary, prioritized skills, and honest strength bullets to start from, without inventing experience you don't have
- ✉️ **Cover letter generator** — generate a tailored cover letter from your resume and a job description, then download it as a PDF
- 🎙️ **Mock interview practice** — answer behavioral and technical questions tailored to your resume and the role, get scored feedback per answer, and keep going for as many rounds as you want
- 📈 **Interview score charts** — visualize how you're doing across a session
- 🕘 **Full history** — every analysis, cover letter, and interview session is saved and revisitable, with undo-able deletes
- 👤 **Account settings** — edit profile, and permanently delete your account and all associated data on request
- 🌗 **Light/dark theme** — persists across sessions

---

## Tech Stack

**Framework:** Next.js (App Router), React

**Styling:** Tailwind CSS

**Auth:** NextAuth (Credentials provider), bcryptjs for password hashing

**Database:** MongoDB + Mongoose

**AI:** Groq SDK (resume/JD analysis, cover letters, interview questions & feedback)

**Files:** `pdf-parse` + `mammoth` (parsing uploaded .pdf/.docx resumes), `@react-pdf/renderer` (generating resume & cover letter PDFs), Cloudinary (file hosting)

**Email:** Resend (password reset)

**Validation:** Zod

**Charts/Icons:** Recharts, Lucide

---

## Libraries Used

| Library               | Purpose                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `next`                | App framework (routing, App Router, API routes, middleware)                                 |
| `react` / `react-dom` | UI library and rendering                                                                    |
| `next-auth`           | Authentication (Credentials provider, session/JWT)                                          |
| `bcryptjs`            | Password hashing and verification                                                           |
| `mongoose`            | MongoDB object modeling and database access                                                 |
| `zod`                 | Request and schema validation                                                               |
| `groq-sdk`            | AI-powered resume analysis, cover letter generation, interview practice, and job comparison |
| `pdf-parse`           | Extracting text from uploaded PDF resumes                                                   |
| `mammoth`             | Extracting text from uploaded `.docx` resumes                                               |
| `@react-pdf/renderer` | Generating downloadable resume and cover letter PDFs                                        |
| `cloudinary`          | Cloud storage for uploaded resumes and generated files                                      |
| `resend`              | Transactional emails (password reset and account emails)                                    |
| `recharts`            | Charts and data visualization for analytics                                                 |
| `lucide-react`        | Modern icon library used throughout the UI                                                  |
| `react-icons`         | Additional icon packs for UI components                                                     |
| `motion`              | Animations and page transitions                                                             |
| `next-themes`         | Light/dark theme support with persistence                                                   |
| `tailwindcss`         | Utility-first CSS framework                                                                 |

---

## Project Structure

```
jd-ready/
├── src/
│   ├── app/
│   │   ├── (app)/            # Authenticated routes: dashboard, builder, compare,
│   │   │                     # cover-letter, interview-prep, history, account
│   │   ├── api/               # Route handlers: auth, analyze, compare, builder
│   │   │                     # (including builder/generate), cover-letters, interview,
│   │   │                     # history, resumes, account, signup, forgot-password,
│   │   │                     # reset-password
│   │   ├── login/, signup/, forgot-password/, reset-password/
│   │   ├── layout.js, page.js, providers.js
│   ├── components/
│   │   ├── landing/           # Hero, Features, HowItWorks, Comparison, FAQ, CTA
│   │   ├── animations/        # Shared motion primitives
│   │   └── *.js               # ResumeAnalyzer, ResumeBuilder, CompareTool,
│   │                          # CoverLetterGenerator, InterviewPractice, HistoryList, ...
│   ├── data/                  # Static landing page copy (features, steps, FAQs)
│   ├── hooks/                 # useUndoableDelete
│   ├── lib/                   # groq.js, mongodb.js, cloudinary.js, email.js,
│   │                          # analyzeResume.js, generateResumeFromJD.js,
│   │                          # interviewPrep.js, resumeParser.js,
│   │                          # ResumePDFDocument.js, CoverLetterPDFDocument.js
│   ├── models/                # User, Resume, ResumeDraft, Analysis, CoverLetter,
│   │                          # InterviewSession (Mongoose schemas)
│   ├── auth.js, auth.config.js, middleware.js
├── public/
├── package.json
└── README.md
```

---

## Getting Started Locally

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- API keys for [Groq](https://console.groq.com), [Resend](https://resend.com), and [Cloudinary](https://cloudinary.com)

### 1. Clone the repo

```bash
git clone https://github.com/1khushibarnwal/jd-ready.git
cd jd-ready
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/jdready?retryWrites=true&w=majority
NEXTAUTH_SECRET=your_long_random_secret
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=your_groq_key
RESEND_API_KEY=your_resend_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Deployment

JDReady is a single Next.js app, so it deploys as one service (e.g. Vercel): _deployment is under progress_

- Set the same environment variables from `.env.local` in your host's dashboard, with `NEXTAUTH_URL` set to your deployed domain.
- Use a MongoDB Atlas cluster with network access opened to your host's IP range (or `0.0.0.0/0` if your host doesn't use fixed IPs).
- Build command: `npm run build` · Start command: `npm start`.

---

## Future Enhancements

Some improvements planned for future versions of JDReady include:

- 🤖 **AI resume rewriting** — rewrite resume bullet points with stronger action verbs and quantify achievements where possible
- 🎯 **Role-specific resume optimization** — generate customized resume versions for different job roles
- 📑 **Additional resume templates** — expand the builder with more ATS-friendly layouts and customization options
- 🌍 **LinkedIn & portfolio analysis** — import profile information and provide suggestions to improve online presence
- 🧠 **Adaptive interview coaching** — personalize interview questions based on previous performance and focus on weak areas
- 📅 **Application tracker** — manage job applications, interviews, deadlines, and statuses from a single dashboard
- 📌 **Saved job descriptions** — bookmark and organize job postings for future comparison
- 📈 **Resume improvement tracking** — monitor how resume changes affect ATS match scores over time
- 🌐 **Support for additional file formats** — allow uploads of formats beyond PDF and DOCX
- 🔍 **Deeper ATS analysis** — provide section-level feedback on formatting, keyword density, readability, and recruiter best practices

---

## Security Notes

- Passwords are hashed with bcrypt before storage; the raw password is never persisted.
- Sessions are handled by NextAuth; protected routes (`/dashboard`, `/history`, `/builder`, `/cover-letter`, `/compare`, `/account`, `/interview-prep`) are gated in `middleware.js` and redirect unauthenticated users to `/login`.
- All resumes, analyses, cover letters, and interview sessions are scoped to the authenticated user — no cross-account access.
- Password reset always returns a generic success message regardless of whether the email exists, to avoid leaking registered emails, and reset tokens are stored hashed with an expiry.
- Account deletion removes the user's associated data on request.

---

## License

MIT

---

Built with ❤️ by [Khushi Barnwal](https://github.com/1khushibarnwal)
