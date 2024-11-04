const express = require('express');
const app = express();
const PORT = 3000;

const usuarioRouter = require("./Router/UsuarioRouter")
const jogoRouter = require("./Router/JogoRouter")
const servidorRouter = require("./Router/ServidorRouter")


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.send("Página Inicial");
})


app.use(function(req, res, next){
    console.log(req.method+" - "+req.originalUrl);
    next();
})

app.use('/api/usuarios', usuarioRouter)
app.use('/api/jogos', jogoRouter)
app.use('/api/servidor', servidorRouter)


app.listen(PORT, () => {
    console.log(`Servidor executando na porta http://localhost:${PORT}`)
})
  



