import express from "express";
import 'dotenv/config'
import cors from 'cors'
// import { clerkMiddleware } from '@clerk/express'
import { getEnv } from "./lib/env";
import keepAliveCronJob from "./lib/cron";
import { clerkWebhookHandler } from "./webhooks/clerk";
import userRouter from './features/user/user.route'
import productRouter from './features/product/product.route'
import streamRouter from './features/stream/stream.route'
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
    env.CLIENT_URL
  ],
  credentials: true
}
))
// app.use(clerkMiddleware)
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/users", userRouter);
 app.use("/api/products", productRouter);
  app.use("/api/stream", streamRouter);
// app.use("/api/checkout", chekoutRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/orders", orderRouter);



//TODO:add error handler middleware
  app.listen(env.PORT, () =>{
    console.log(`listening on port ${env.PORT}`)
    if(env.NODE_ENV==='production'){
      //this cron job to keep the render server alive 
      keepAliveCronJob.start()
    }
  });


