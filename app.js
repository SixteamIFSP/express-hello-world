const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const rotaUsuario = require('./routes/users');
const rotaTurma = require('./routes/turmas');
const rotaDesempenho = require('./routes/desempenho');
const rotaImagem = require('./routes/image');
const rotaAula = require('./routes/aulas');
const rotaTriagem = require('./routes/triagem');
const rotaDashboard = require('./routes/dashboard');
const rotaEmail = require('./routes/email');
const rotaMaterialExtra = require('./routes/materialExtra');
const rotaNotificacao = require('./routes/notificacaoPush');
const rotaAluno = require('./routes/alunos');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header', 
        'Origin','X-Requested-With', 'Content-Type', 'Accept', 'Authorization' 
    );
    res.header('Cache-Control', 'max-age=31536000');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1, mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Strict-Transport-Security', 'max-age=63072000, includeSubDomains, preload');
    res.header('Referrer-Policy', 'no-referrer, strict-origin-when-cross-origin');
    res.header('Content-Security-Policy', "frame-ancestors 'none'");
    res.header('Permissions-Policy', 'interest-cohort=()');
    if(req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.get('/', (req, res) => {
  res.send('SERVIDOR FUNCIONANDO');
});
app.use('/user', rotaUsuario);
app.use('/turma', rotaTurma);
app.use('/desempenho', rotaDesempenho);
app.use('/imagem', rotaImagem);
app.use('/aula', rotaAula);
app.use('/triagem', rotaTriagem);
app.use('/dashboard', rotaDashboard);
app.use('/email', rotaEmail);
app.use('/materialExtra', rotaMaterialExtra);
app.use('/mensagem', rotaNotificacao);
app.use('/aluno', rotaAluno);



const port = (process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});