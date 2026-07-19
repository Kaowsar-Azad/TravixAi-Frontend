<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16/React 19 Warning
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TravelX AI Project Requirements & Guidelines

You must follow these rules strictly while building the TravelX AI application.

## 1. Project Overview & Concept
- **Name**: TravelX AI
- **Concept**: A production-ready Full-Stack Agentic AI Travel Assistant & Planner that helps users generate customized day-by-day itineraries, explore travel options, and chat with an intelligent AI travel agent.

## 2. Technology Stack
- **Frontend**: Next.js (v16) / React (v19) + TypeScript (Mandatory) + Tailwind CSS + HeroUI (`@heroui/react`, `@heroui/styles`) + Lucide Icons (`lucide-react`) + Recharts + Axios
- **Backend**: Node.js + Express.js + TypeScript + MongoDB (`mongodb`/`mongoose`) + dotenv + cors + Better Auth (or custom JWT Authentication)
- **AI Provider**: Google Gemini API (`@google/generative-ai`) or Vercel AI SDK

## 3. Global UI & Design Rules
- Use a **maximum of 3 primary colors** (+ optional neutral color) for a professional, premium aesthetic (e.g., modern indigo/slate/emerald).
- Consistent layout, padding, margin, and alignment throughout the app.
- All cards and dashboard components must have the exact same size, border radius, and style.
- Fully responsive on mobile, tablet, and desktop.
- **NO placeholder or dummy content** (no Lorem Ipsum). All content must be realistic.

## 4. Pages and Routing Structure

### Public Pages:
1. **Home / Landing Page (`/`)**:
   - Sticky navbar: 3 routes when logged out (Home, Explore, About/Contact), 5 routes when logged in (Home, Explore, Add Plan, Manage Plans, About/Contact).
   - Hero section (60-70% height) with interactive CTA.
   - At least 7 distinct sections (e.g., Features, AI Planner Intro, Stats, Highlights, Testimonials, FAQ, CTA Banner).
   - Fully functional footer with working links and social icons.
2. **Explore / Listing Page (`/explore`)**:
   - Search bar.
   - Filtering using at least 2 fields (e.g., Destination/Category, Budget Range, Travel Duration, Rating).
   - Sorting options (e.g., Price Low-High, Rating, Date).
   - Pagination or infinite scroll.
   - Responsive grid (Desktop: 4 cards per row, same height/width, skeleton loaders).
3. **Details Page (`/explore/[id]`)**:
   - Details of a travel plan/destination (publicly accessible).
   - Multiple images/carousel, description, key specifications, reviews, and related travel items.
4. **Auth Pages (`/login` & `/register`)**:
   - Demo login button (auto-fill credentials).
   - Google social login.
   - Proper form validation and error handling.
5. **Static Pages**:
   - **About Page (`/about`)**
   - **Contact/Help Page (`/contact`)**

### Protected Pages (Requires login, redirect to `/login` if unauthenticated):
6. **Add Travel Plan (`/items/add`)**:
   - Form fields: Title, Short Description, Full Description, Price/Budget, Duration/Dates, Image URL, Submit.
7. **Manage Travel Plans (`/items/manage`)**:
   - Admin/User dashboard table or grid showing user-created travel items/plans.
   - Actions: View Details, Delete.

## 5. Agentic AI Features (Minimum 2 Required)

### Feature 1: AI Smart Recommendation Engine (Itinerary Planner)
- Analyzes user preferences (destination, duration, budget, style of travel - e.g., adventure, relaxation, food, culture).
- Generates a highly detailed, personalized day-by-day travel plan (Itinerary) with pricing and matching categories.
- Context-aware: allows user to filter, refine, or regenerate.

### Feature 2: AI Conversational Travel Assistant (Chat Agent)
- Sticky chat drawer/widget accessible in the app.
- Understands application context (e.g., knows about the current generated travel plan).
- Features: Conversation history, typing indicators, suggested follow-up questions (e.g., "What are the food options in Day 2?", "Suggest budget friendly hostels here").

## 6. UX & Quality Checklist
- Elegant skeleton loaders on explore page.
- Smooth animations using `framer-motion` (supported by HeroUI).
- Proper validation on all forms.
- Interactive design with clear hover states and professional styling.

## 7. Development Practices
- **Always use Tailwind CSS**. Do NOT use inline CSS under any circumstances.
