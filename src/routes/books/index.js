import express from "express"
import fs from "fs"

const router = express.Router() // crea il "gestore" della rotta

router.get("/", (req, res) => {
    res.send(JSON.parse(fs.readFileSync("./src/routes/books/books.json")))
})

router.post("/", (req, res) => {
    // prendi il body
    const toAdd = req.body
    if (!toAdd.title || !toAdd.author || !toAdd.year) {
        res.status(400).send("Missing parameters")
        return
    }
    // leggi il file come fosse un json
    const booksAsString = fs.readFileSync("./src/routes/books/books.json")
    const books = JSON.parse(booksAsString)
    // append del body
    books.push(toAdd)
    // scrivi il file
    fs.writeFileSync("./src/routes/books/books.json", JSON.stringify(books))
    // ritorna l'indice
    res.send({ index: books.length - 1})
})

router.put("/:index", (req,res)=> {
    const index = req.params.index

    const books = JSON.parse(fs.readFileSync("./src/routes/books/books.json"))
    const toUpdate = books[index]
    if(!toUpdate){
        res.status(404).send("Not found")
        return
    }
    books[index] = req.body //volendo potrei metterci della validazione (es.: autore, titolo, year)
    fs.writeFileSync("./src/routes/books/books.json", JSON.stringify(books))
    res.send("OK")

    //leggi il file
    // modifica l'elemento all'indice index
    // ritorna OK se ha funzionato
})

router.delete("/:index", (req, res) => {
    // leggere il file
    const books = JSON.parse(fs.readFileSync("./src/routes/books/books.json"))
    books.splice(req.params.index, 1)
    fs.writeFileSync("./src/routes/books/books.json", JSON.stringify(books))
    // rimuovere l'elemento in posizione X
    // scrivere il file
    res.send("OK")
})


export default router