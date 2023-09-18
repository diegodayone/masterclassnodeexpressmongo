import express from "express"
import urlSchema from "./urlSchema.js"

const router = express.Router()

const generateRandomString = (myLength) => {
    const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
  
    const randomString = randomArray.join("");
    return randomString;
  };
  

router.get("/:url", async (req,res) => {
    // url => req.params.url
    const URL = req.params.url
    // cerco sul DB un elemento con shorterURL === url
    const item = await urlSchema.findOne({shorterURL: URL})
    if (item) {
        item.clicks++
        await item.save()
        // se c'è => daje
        res.send(item.initialURL)
    }
    else {
        res.status(404).send()
        // se non c'è => aiuto
    }
})

router.post("/", async (req, res) => {
    const toAdd = req.body
    console.log(toAdd, toAdd.initialURL)
    const uniqueString = generateRandomString(9)
    const newItem = await urlSchema.create({initialURL: toAdd.initialURL, shorterURL: uniqueString})
    res.send(newItem)
})

router.delete("/:shorterURL", async(req, res) => {
    const result = await urlSchema.deleteOne({shorterURL: req.params.shorterURL})
    if (result.deletedCount === 1) {
        res.send("OK")
    }
    else {
        res.status(404).send()
    }
})

export default router