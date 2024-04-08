import app from "./app.js"

const main = async () => {
    app.listen(process.env.PORT)
    console.log(`server is listening on port ${ process.env.PORT }`)
}

main()