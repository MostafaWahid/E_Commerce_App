import express from "express";
import 'dotenv/config'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { getEnv } from "./lib/env";
import fs from 'node:fs'
import path from "node:path";
import { clerkWebhookHandler } from "./webhooks/clerk";
const env=getEnv()
const app=express()
const rawJson=express.raw({type:'application/json',limit:'1mb'})
app.post("/webhooks/clerk", rawJson, (req, res) => {
  void clerkWebhookHandler(req, res);
});
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware)



const publicDir = path.join(process.cwd(), "public")

if (fs.existsSync(publicDir)) {
  // Serve actual physical files (js, css, images)
  app.use(express.static(publicDir))

  // The Catch-all for SPA (Must be the VERY LAST route)
  app.get('(.*)', (req, res) => {
    // If it's a GET request and NOT an API call, send the index.html
    if (!req.path.startsWith("/api") && !req.path.startsWith("/webhooks")) {
      res.sendFile(path.join(publicDir, "index.html"));
    } else {
      // If it IS an API call that got here, it truly doesn't exist
      res.status(404).json({ error: "API route not found" });
    }
  })
}
app.listen(env.PORT ,()=>{
console.log(`listening on port ${env.PORT}`)
})