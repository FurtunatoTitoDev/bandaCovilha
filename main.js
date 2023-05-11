require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { urlencoded } = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

// CONEXÃO BASE DE DADOS

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("CONECTADO COM SUCESSO!"));

// USAR MILDDLEWARE

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "Chave Secreta",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// LISTEN UPLOAD STATIC
app.use(express.static("uploads"));

// SET TEMPLATE ENGINE
app.set("view engine", "ejs");

// ROUTE PREFIX

app.use("", require("./routes/routes"));

app.use(express.static(__dirname + "/public"));

app.listen(PORT, () => {
  console.log(`Servidor Rodado Em http://localhost:${PORT}`);
});
