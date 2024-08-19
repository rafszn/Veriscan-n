import express from 'express'
import cors from 'cors'
import TeachableMachine from '@sashido/teachablemachine-node'
import dotenv from 'dotenv'
import multer from 'multer'
import fs from 'fs'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8880

const model = new TeachableMachine({
  modelUrl: process.env.TMURL
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   return cb(null, '/tmp');
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use(express.json())
app.use(cors())


app.get('/', (req, res)=>{
  res.send(`<h4>Server is running </h4>`)
})

app.post('/deepfake',upload.single('file'), async (req, res)=>{

  try {
    const image = req.file.path
    const imageData = fs.readFileSync(image)
    const dataurl = `data:image/jpeg;base64,${imageData.toString('base64')}`
    const predictions = await model.classify({
       imageUrl: dataurl
    })
  // console.log(predictions)
  res.status(200).json(predictions)

  } catch (error) {
    res.status(400).json({message: 'Something went wrong'})
  }
})

app.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}...`)
})