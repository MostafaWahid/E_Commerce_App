import express from "express";
import 'dotenv/config'
import cors from 'cors'
import * as Sentry from "@sentry/node";
 import { clerkMiddleware } from '@clerk/express'
import { getEnv } from "./lib/env";
import keepAliveCronJob from "./lib/cron";
import { clerkWebhookHandler } from "./webhooks/clerk";
import userRouter from './features/user/user.route'
import productRouter from './features/product/product.route'
import streamRouter from './features/stream/stream.route'
import checkoutRouter from './features/checkout/checkout.route'
import adminRouter from './features/admin/admin.route'
import orderRouter from './features/order/order.route'
import { polarWebhookHandler } from "./webhooks/polar";
import { sentryClerkUserMiddleware } from "./middleware/sentryClerkUser";
const env=getEnv()
const app=express()
const rawJson=express.raw({type:'application/json',limit:'1mb'})
app.post("/webhooks/clerk", rawJson, (req, res) => {
  void clerkWebhookHandler(req, res);
});
app.post("/webhooks/polar", rawJson, (req, res) => {
  void polarWebhookHandler(req, res);
});
app.use(express.json())
// app.use(cors(
//   {
//   origin: [
//     env.CLIENT_URL
//   ],
//   credentials: true
// }
// ))


app.use(cors({
  origin:env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'baggage', 'sentry-trace'],
  credentials: true
}));
app.use(clerkMiddleware())
app.use(sentryClerkUserMiddleware)
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/users", userRouter);
 app.use("/api/products", productRouter);
  app.use("/api/stream", streamRouter);
 app.use("/api/checkout", checkoutRouter);
 app.use("/api/admin", adminRouter);
 app.use("/api/orders", orderRouter);

Sentry.setupExpressErrorHandler(app); 


app.use((_err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  const sentryId=(res as express.Response &{sentry?:string}).sentry


  res.status(500).json({
    error:'Internal server error ',
    ...(sentryId!=='undefined'&&{sentryId}),

  })

})

  app.listen(env.PORT, () =>{
    console.log(`listening on port ${env.PORT}`)
    if(env.NODE_ENV==='production'){
      //this cron job to keep the render server alive 
      keepAliveCronJob.start()
    }
  });


