import express from "express";
import 'dotenv/config'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { getEnv } from "./lib/env";

import { clerkWebhookHandler } from "./webhooks/clerk";
const env=getEnv()
const app=express()
const rawJson=express.raw({type:'application/json',limit:'1mb'})
app.post("/webhooks/clerk", rawJson, (req, res) => {
  void clerkWebhookHandler(req, res);
});
app.use(express.json())
app.use(cors(
  {
  origin: [
    'http://localhost:5173',          // Local Vite
    'https://e-commerce-app-lime-alpha.vercel.app'     // Your future Vercel URL
  ],
  credentials: true
}
))
app.use(clerkMiddleware)
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});






if (env.NODE_ENV !== 'production') {
  app.listen(env.PORT, () =>console.log(`listening on port ${env.PORT}`));
}