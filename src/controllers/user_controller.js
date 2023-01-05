const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class user_controller {
  //criando o usuario
  async createUser(req, res) {
    //pegando valores do body
    const { name, email, password } = req.body;
    //fim da captura de valores

    //conexão com o banco de dados
    const database = await sqliteConnection();
    //fim da conecxão com banco de dados

    //buscando email existente no banco de dados
    const checkUserExist = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    //fim buscando email

    //checando se há usuario com o mesmo email cadastrado
    if (checkUserExist) {
      throw new AppError("esse email já está em uso");
    }
    //fim do check do email

    //criptografia from password
    const bcryptjs_hash_password = await hash(password, 8);
    //end criptograf password

    //inserindo informações (REGISTROS) no banco de dados
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, bcryptjs_hash_password]
    );
    //fim da inserção

    //tratamento de erro
    if (!name) {
      throw new AppError("nome é obrigatório");
    }
    //fim do tratamento de erro
    return res.status(201).json();
  }
  //fim criação do usuario

  //atualizando o usuario
  async UpdateUser(req, res) {
    const { name, email, password, old_pass } = req.body;
    const { id } = req.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id =(?)", [id]);

    if (!user) {
      throw new AppError("Este usuario não foi encontrado");
    }

    const checkUpdateEmailExist = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    //arrumar
    if (checkUpdateEmailExist && checkUpdateEmailExist.id !== user.id) {
      throw new AppError("este email já esta em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;


    if(password && !old_pass){
      throw new AppError('informe a senha antiga')
    }

    if(password && old_pass){
      const  checkOldPass = await compare(old_pass, user.password)

      if(!checkOldPass){
        throw new AppError('a senha antiga nao confere')
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
      [user.name, user.email, user.password, id] 
    );

    return res.status(200).json();
  }
}
module.exports = user_controller;
