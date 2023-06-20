const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//config
dotenv.config({ path: "backend/config/config.env" });

//connecting Database
connectDatabase();

const server=app.listen(process.env.PORT, () => {
    console.log(`server worrking on http//:localhost:${process.env.PORT}`);
});






//unhandled promise rejection

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise rejection`)
    
    server.close(()=>{
        process.exit(1)
    })
    
})





