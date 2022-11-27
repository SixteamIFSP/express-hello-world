const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('FightIt API', () => {

    describe("POST /user/cadastro/aluno", () => {
        it("It should POST a new Aluno", (done) => {
            const aluno = {
                nome: "Teste Mocha",
                email: 'vtinhosampa@hotmail.com',
                senha: '11223344',
                telefone: '1255678934',
                receberNot: '0'
            };
            chai.request(server)                
                .post("/user/cadastro/aluno")
                .send(aluno)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Aluno Cadastrado com sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("POST /user/cadastro/professor", () => {
        it("It should POST a new Professor", (done) => {
            const professor = {
                nome: "Teste Mocha Professor",
                email: 'victosampa@gmail.com',
                senha: '11223344',
                telefone: '1255678934',
                receberNot: '0'
            };
            chai.request(server)                
                .post("/user/cadastro/Professor")
                .send(professor)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Professor Cadastrado com sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("POST /user/login/aluno", () => {
        it("It should POST a login for Aluno", (done) => {
            const aluno = {
                email: 'vtinhosampa@hotmail.com',
                senha: '11223344'
            };
            chai.request(server)                
                .post("/user/login/aluno")
                .send(aluno)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Autenticado com sucesso");
                    response.body.should.have.property('nome').eq("Teste Mocha");
                    response.body.should.have.property('email').eq("vtinhosampa@hotmail.com");
                    response.body.should.have.property('tipoUsuario').eq(2);
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });

        it("It should not POST a login for Aluno if email/password is wrong", (done) => {
            const aluno = {
                email: 'vtinhosampa@gmail.com',
                senha: '36478236'
            };
            chai.request(server)                
                .post("/user/login/aluno")
                .send(aluno)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("E-mail ou Senha incorretos");
                    response.body.should.have.property('status').eq(false);
                done();
                });
        });
    });

    describe("POST /user/login/professor", () => {
        it("It should POST a login for Professor", (done) => {
            const professor = {
                email: 'victosampa@gmail.com',
                senha: '11223344',
            };
            chai.request(server)                
                .post("/user/login/professor")
                .send(professor)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Autenticado com sucesso");
                    response.body.should.have.property('nome').eq("Teste Mocha Professor");
                    response.body.should.have.property('email').eq("victosampa@gmail.com");
                    response.body.should.have.property('tipoUsuario').eq(1);
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });

        it("It should not POST a login for Professor with wrong email/password", (done) => {
            const professor = {
                email: 'victosampa@hotmail.com',
                senha: '1235678',
            };
            chai.request(server)                
                .post("/user/login/professor")
                .send(professor)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("E-mail ou Senha incorretos");
                    response.body.should.have.property('status').eq(false);
                done();
                });
        });
    });

    describe("PATCH /user/senha/aluno", () => {
        it("It should PATCH the password from Aluno", (done) => {
            const aluno = {
                id: 2,
                senhaAntiga: '123456',
                senha: '11223344',
            };
            chai.request(server)                
                .patch("/user/senha/aluno")
                .send(aluno)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Senha Alterada com Sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("PATCH /user/senha/professor", () => {
        it("It should PATCH the password from Professor", (done) => {
            const professor = {
                id: 2,
                senhaAntiga: '11223344',
                senha: '123456',
            };
            chai.request(server)                
                .patch("/user/senha/professor")
                .send(professor)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Senha Alterada com Sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("PATCH /user/perfil/aluno", () => {
        it("It should PATCH the profile from Aluno", (done) => {
            const aluno = {
                id: 1,
                nome: 'Vitinho',
                receberNot: '1',
                telefone: '981878634'
            };
            chai.request(server)                
                .patch("/user/perfil/aluno")
                .send(aluno)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Perfil Alterado com Sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("PATCH /user/perfil/professor", () => {
        it("It should PATCH the profile from Professor", (done) => {
            const professor = {
                id: 1,
                nome: 'Vitinho Prof',
                receberNot: '1',
                telefone: '981878634'
            };
            chai.request(server)                
                .patch("/user/perfil/professor")
                .send(professor)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Perfil Alterado com Sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("GET /user/busca/aluno/:id_aluno", () => {
        it("It should GET the profile from Aluno", (done) => {
            const alunoId = 1; 
            chai.request(server)                
                .get("/user/busca/aluno/" + alunoId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Busca realizada com sucesso");
                    response.body.should.have.property('result');
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("GET /user/busca/professor/:id_professor", () => {
        it("It should GET the profile from Professor", (done) => {
            const userId = 1; 
            chai.request(server)                
                .get("/user/busca/professor/" + userId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Busca realizada com sucesso");
                    response.body.should.have.property('result');
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

//turma 

    describe("POST /turma/criar", () => {
        it("It should POST a new Turma", (done) => {
            const turma = {
                nome: 'Turminha 2.0',
                professorId: '1',
                descricao: 'Turma do vtinho'
            };
            chai.request(server)                
                .post("/turma/criar")
                .send(turma)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Turma criada com sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("POST /turma/alterar", () => {
        it("It should POST a new name and or description for a Turma", (done) => {
            const turmaAlterar = {
                nome: 'Turminha 3.0',
                descricao: 'Turma do vtinho',
                turmaId: '113',
            };
            chai.request(server)                
                .post("/turma/criar")
                .send(turmaAlterar)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Turma alterada com sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("POST /turma/adiciona", () => {
        it("It should POST a new student on a Turma", (done) => {
            const turmaAlunoAdd = {
                alunoID: '64',
                turmaId: '12'
            };
            chai.request(server)                
                .post("/turma/criar")
                .send(turmaAlunoAdd)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Aluno inserido com sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("GET /turma/busca/:id_professor", () => {
        it("It should GET the Professor's turma", (done) => {
            const turmaProfessor = 5; 
            chai.request(server)                
                .get("/turma/busca/" + turmaProfessor)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Busca realizada com sucesso");
                    response.body.should.have.property('result');
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("GET /turma/busca/aluno/:id_aluno", () => {
        it("It should GET the aluno from turma", (done) => {
            const turmaAluno = 53; 
            chai.request(server)                
                .get("/turma/busca/" + turmaAluno)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Busca realizada com sucesso");
                    response.body.should.have.property('result');
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("DELETE /turma//excluir/turma/:id_turma", () => {
        it("It should DELETE a turma", (done) => {
            const turmaId = 53; 
            chai.request(server)                
                .delete("/turma/busca/" + turmaId)
                .send(turmaId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Turma Excluida");
                    response.body.should.have.property('result');
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

// Triagem

    describe("POST /triagem/criarTriagem", () => {
        it("It should POST a new student's triagem", (done) => {
            const triagem = {
                dataNascimento: '21/04/2001',
                altura: '1,60',
                peso: '60',
                problemaOrtopedico: 'Não',
                doencasCronicas: 'Sim, asma',
                lesoes: 'Nã0',
                alunoId: '53'
            };
            chai.request(server)                
                .post("/triagem/criarTriagem")
                .send(triagem)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Triagem registrada com sucesso!");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("GET /triagem/acessarTriagem/:id_aluno", () => {
        it("It should GET the aluno's triagem", (done) => {
            const alunoTriagemId = 71; 
            chai.request(server)                
                .get("/turma/busca/" + alunoTriagemId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Busca realizada com sucesso");
                    response.body.should.have.property('result');
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

    describe("PATCH /triagem/atualizarTriagem", () => {
        it("It should PATCH the aluno's triagem", (done) => {
            const triagemAtt = {
                id: 3,
                dataNascimento: '21/04/2001',
                altura: '1,60',
                peso: '60',
                problemaOrtopedico: 'Não',
                doencasCronicas: 'Sim, asma',
                lesoes: 'Nã0',
                alunoId: '53'
            };
            chai.request(server)                
                .patch("/triagem/atualizarTriagem")
                .send(triagemAtt)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('mensagem').eq("Triagem atualizada com Sucesso");
                    response.body.should.have.property('status').eq(true);
                done();
                });
        });
    });

// Dashboard




})