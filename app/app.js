const express = require("express");
const session = require("express-session");
const router = require("./utilities/routes.js")
const path = require("path")
const app = express();


app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(
    session({
        secret: "nessuno conosce il segreto",
        resave: false,
        saveUninitialized: false,
    })
);

app.use('/api', router);

app.listen(3000, async () => {
    console.log("Server running on port 3000");
});
