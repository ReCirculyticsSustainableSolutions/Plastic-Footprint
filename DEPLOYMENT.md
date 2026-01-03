# Deployment Guide for Packaging Footprint Calculator

This project consists of two parts:
1. **Server (Backend)**: Node.js, Express, MongoDB
2. **Client (Frontend)**: React, Vite

We recommend deploying the **Server to Render** and the **Client to Vercel**.

---

## 1. Deploying the Server (Backend)

We will use [Render](https://render.com/) for the backend because it offers a free tier for Node.js web services.

### Steps:
1. **Push your code to GitHub** (if you haven't already).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New +" -> "Web Service"**.
3. Connect your GitHub repository.
4. **Configuration**:
   - **Root Directory**: `server` (Important! This tells Render the backend is in the `server` folder)
   - **Name**: `footprint-server` (or any name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables**:
   Scroll down to the "Environment Variables" section and add the following:
   - `MONGODB_URI`: Your MongoDB Connection String (from MongoDB Atlas)
   - `JWT_SECRET`: A long random string (e.g., `mysecretkey123!@#`)
   - `PORT`: `10000` (Render sets this automatically, but good to know)
6. Click **"Create Web Service"**.
7. Wait for the deployment to finish. **Copy the URL** provided by Render (e.g., `https://footprint-server.onrender.com`). You will need this for the Client.

---

## 2. Deploying the Client (Frontend)

We will use [Vercel](https://vercel.com/) for the frontend as it is optimized for React/Vite apps.

### Steps:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." -> "Project"**.
2. Import your GitHub repository.
3. **Configuration**:
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" and select `client`.
4. **Environment Variables**:
   Expand the "Environment Variables" section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: The URL of your deployed Server from Step 1 (e.g., `https://footprint-server.onrender.com`). **Do not add a trailing slash `/`**.
5. Click **"Deploy"**.

---

## 3. Final Verification

1. Open your deployed Vercel URL (e.g., `https://footprint-calculator.vercel.app`).
2. Try to **Log In** or **Sign Up**.
   - If it works, the connection to the backend is successful!
   - If you get an error, check the Browser Console (F12) for network errors. Ensure the `VITE_API_URL` is correct and does not have a trailing slash.

## Troubleshooting

- **CORS Errors**: If you see CORS errors in the console, you may need to update the `cors` configuration in `server/index.js` to explicitly allow your Vercel domain.
  ```javascript
  // server/index.js
  app.use(cors({
      origin: ['https://your-vercel-app.vercel.app', 'http://localhost:5173']
  }));
  ```
- **MongoDB Connection**: Ensure your MongoDB Atlas Network Access allows "Allow Access from Anywhere" (0.0.0.0/0) or explicitly allow Render's IP addresses.
