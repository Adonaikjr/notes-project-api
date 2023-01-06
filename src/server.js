require("express-async-errors");
const AppError = require("./utils/AppError");

const express = require("express");
const MigrationsStart = require("./database/sqlite/migrations");
const uploadConfig = require('./configs/upload')

const routes = require("./routes");
const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.UPLOAD_FOLDER))

app.use(routes);

MigrationsStart();

app.use((error, req, res, next) => {
  //tratamento de erro do USUARIO
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }
  //fim tratamento de erro do USUARIO

  console.log(error);

  //tratamento de erro dentro do SERVIDOR
  return res.status(500).json({
    status: "error",
    message: "erro no servidor",
  });
  //fim tratamento de erro dentro do SERVIDOR
});

const PORT = 3333;
app.listen(PORT, () => console.log(`server online 🚀 ${PORT}`));
