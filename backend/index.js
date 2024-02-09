import express from 'express'
import auth_router from "./routes/auth.routes.js";
import user_router from "./routes/user.routes.js";
import cors from "cors";



const PORT = process.env.PORT || 5000
const app  = express()

app.use(express.json())
app.use(cors())
app.use('/auth',auth_router)
app.use('/user',user_router)
app.listen(PORT,() => console.log('server working on port '+PORT))