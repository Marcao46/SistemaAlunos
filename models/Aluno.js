const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: String,
  turma: String,
  notas: [Number]
});

module.exports = mongoose.model('Aluno', AlunoSchema);