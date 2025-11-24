# WriteHub

WriteHub is a MERN-style blogging platform that lets users register, publish posts with inline images, comment, and manage their profile avatars. All uploaded media (post images and profile photos) is stored directly inside MongoDB, so no local filesystem storage is required.

## Tech Stack
- **Client:** React 18 + Vite, React Router, Axios, React Toastify, Tailwind CSS
- **Server:** Node.js, Express 5, Mongoose, JSON Web Tokens, Bcrypt
- **Database:** MongoDB (Atlas or self-hosted)

## Prerequisites
- Node.js 18 or newer (LTS recommended)
- npm 9+ (bundled with Node)
- Access to a MongoDB instance

## Project Structure
```
client/   # React front-end (Vite)
server/   # Express API server
```

## 1. Backend Setup (`server/`)
1. Install dependencies:
   ```powershell
   cd server
   npm install
   ```
2. Create a `.env` file in `server/` with the following keys:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
   JWT_SECRET=replace_with_strong_secret
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
   - `PORT` is optional (defaults to `5000`).
   - `MONGO_URI` must point to your MongoDB deployment.
   - `CLIENT_URL` can contain one or more comma-separated origins allowed by CORS (e.g., production domain).
3. Start the API in development mode:
   ```powershell
   npm run dev
   ```
   The server listens on `http://localhost:5000` by default.

## 2. Frontend Setup (`client/`)
1. Install dependencies:
   ```powershell
   cd client
   npm install
   ```
2. Create a `.env` file in `client/` to point to the API:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Adjust this URL when deploying.
3. Start the Vite dev server:
   ```powershell
   npm run dev
   ```
   Vite serves the app at `http://localhost:5173` by default.

## Running the full stack locally
1. Start MongoDB (or ensure your Atlas cluster is reachable).
2. Run `npm run dev` inside `server/`.
3. In a separate terminal, run `npm run dev` inside `client/`.
4. Visit `http://localhost:5173` to use the app.

## Environment Notes
- Uploads are sent as Base64 data URLs from the client and persisted as binary buffers inside MongoDB. No local `uploads/` directory is required.
- Update `CLIENT_URL` and `VITE_API_URL` to match your deployment domains before going live.

## Available API Routes (summary)
- `POST /api/auth/register` – create a new account
- `POST /api/auth/login` – authenticate and receive a JWT
- `GET /api/auth/me` – fetch the current user profile
- `PATCH /api/auth/bio` – update user biography
- `PATCH /api/auth/avatar` – update avatar (Base64 image payload)
- `GET /api/posts` – list posts
- `POST /api/posts` – create a post (title, content, Base64 image array)
- `PUT /api/posts/:postId` – update a post
- `DELETE /api/posts/:postId` – delete a post
- `POST /api/posts/:postId/like` – toggle like for a post
- `POST /api/posts/:postId/comments` – add a comment
- `DELETE /api/posts/:postId/comments/:commentId` – delete a comment

