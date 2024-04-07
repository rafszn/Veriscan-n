import express from 'express'
import cors from 'cors'
import TeachableMachine from '@sashido/teachablemachine-node'
import dotenv from 'dotenv'
dotenv.config()




async function main (){

const model = new TeachableMachine({
  modelUrl: process.env.TMURL
})

try {
  
  const predictions = await model.classify({
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSStVFrLk7LNKEq18FZf0ZmoyY4oKT74h6ylLZIvovpEw&s'
    })

    console.log(predictions)

} catch (error) {
  console.log(error)
}

}

main()
