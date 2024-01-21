import express from 'express'
import auth_controller from "./routes/auth.routes.js";

const PORT = process.env.PORT || 5000
const app  = express()

app.use(express.json())
app.use('/auth',auth_controller)
app.listen(PORT,() => console.log('server working on port '+PORT))