import express from "express";
import cors from "cors";
import TeachableMachine from "@sashido/teachablemachine-node";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8880;

const model = new TeachableMachine({
  modelUrl: process.env.TMURL,
});

const upload = multer({ dest: "/tmp/" });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`<h4>Server is running </h4>`);
});

app.post("/deepfake", upload.single("file"), async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD,
    api_secret: process.env.CLOUD_SECRET,
  });

  try {
    const { path } = req.file;

    const response = await cloudinary.uploader.upload(path, {
      public_id: "deep",
    });

    const url = response.secure_url;

    const predictions = await model.classify({
      imageUrl: url,
    });

    res.status(200).json(predictions);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});
