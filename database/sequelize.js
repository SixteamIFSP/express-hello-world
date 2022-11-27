
const Sequelize = require('sequelize');
const freezeTableName = { freezeTableName: true };
const envPathFileUrl = path.join(__dirname, '../.env');

require('dotenv').config({ path: envPathFileUrl });

const sequelize = new Sequelize(
    process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql"
});
console.log(process.env.DATABASE_NAME)
const Professor = sequelize.define('Professore', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    receberNotificacoes: {
        type: Sequelize.BOOLEAN,
    },
    Telefone: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
}, freezeTableName);

const Aluno = sequelize.define('Aluno', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    receberNotificacoes: {
        type: Sequelize.BOOLEAN,
    },
    Telefone: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
}, freezeTableName);

const ArteMarcial = sequelize.define('ArteMarciai', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
}, freezeTableName);

const Turma = sequelize.define('Turma', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
}, freezeTableName);

const TipoParametro = sequelize.define('TipoParametro', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, freezeTableName);

const Parametro = sequelize.define('Parametro', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
}, freezeTableName);

const DesempenhoAluno = sequelize.define('DesempenhoAluno', {
    Nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, freezeTableName);

const Aulas = sequelize.define('Aula', {
    NomeAula: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    Descricao: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
}, freezeTableName);

const MaterialExtra = sequelize.define('MaterialExtra', {
    NomeMaterial: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Descricao: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, freezeTableName);

const Equipamentos = sequelize.define('Equipamento', {
    NomeEquipamento: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Foto: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, freezeTableName);



Aluno.hasOne(DesempenhoAluno);
TipoParametro.hasMany(Parametro);
Parametro.belongsToMany(DesempenhoAluno, { through: 'Desempenho_Parametro' })
Professor.hasMany(Turma, { foreignKey: 'ProfessorId' });
Professor.belongsToMany(ArteMarcial, { through: 'Leciona' });
Aluno.belongsToMany(Turma, { through: 'Aluno_Turma' });
sequelize.sync();
Aulas.hasMany(MaterialExtra);
Turma.hasMany(Aulas);
//TipoUsuario.sync();
/* 
const ArteMarcial = sequelize.define('ArteMarcial', {
    Nome: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, freezeTableName);

const Turma = sequelize.define('Turma', {
    idProfessor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nomeTurma: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, freezeTableName);

const Triagem = sequelize.define('Triagem', {
    Fumante: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    Doenças: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    Lesões: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    dataTriagem: { type: Sequelize.DATE }
}, freezeTableName);

//TODO verificar se ppoderemos deixar o professor definir os parametros min e max
const ParametroDesempenho = sequelize.define('ParametroDesempenho', {
    nomeParametro: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    valorMinimoReferencia: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    valorMaximoReferencia: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
}, freezeTableName);

const DesempenhoDoAluno = sequelize.define('desempenhoDoAluno', {
    data: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, freezeTableName);



const Aulas = sequelize.define('Aulas', {
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    materialExtra: { type: Sequelize.TEXT }
}, freezeTableName);

const Equipamentos = sequelize.define('Equipamentos', {
    nome: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, freezeTableName);

const FeedbackAula = sequelize.define('FeedbackAula', {
    codAula: { type: Sequelize.INTEGER },
    feedback: { type: Sequelize.TEXT }
}, freezeTableName);
 */
//verifica se conseguimos conectar com sucesso ao BD 
sequelize.authenticate()
    .then(() => { console.log("conectado com sucesso") })
    .catch((err) => { console.log("falha ao conectar: " + err) });
