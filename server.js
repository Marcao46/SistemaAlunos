const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Aluno = require('./models/Aluno');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// conexão Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// INSERT
app.post('/api/aluno', async (req, res) => {
  const aluno = new Aluno(req.body);
  await aluno.save();
  res.json({ mensagem: 'Aluno cadastrado!' });
});

// FIND
app.get('/api/alunos/:turma', async (req, res) => {
  const alunos = await Aluno.find({ turma: req.params.turma });
  res.json(alunos);
});

// UPDATE
app.put('/api/aluno/:id', async (req, res) => {
  await Aluno.updateOne(
    { _id: req.params.id },
    { $set: { notas: req.body.notas } }
  );
  res.json({ mensagem: 'Atualizado!' });
});

// DELETE
app.delete('/api/aluno/:id', async (req, res) => {
  await Aluno.deleteOne({ _id: req.params.id });
  res.json({ mensagem: 'Removido!' });
});

// REPLACE
app.put('/api/aluno/replace/:id', async (req, res) => {
  await Aluno.replaceOne({ _id: req.params.id }, req.body);
  res.json({ mensagem: 'Substituído!' });
});

// AGGREGATE
app.get('/api/media', async (req, res) => {
  const resultado = await Aluno.aggregate([
    { $unwind: '$notas' },
    {
      $group: {
        _id: '$nome',
        media: { $avg: '$notas' }
      }
    }
  ]);
  res.json(resultado);
});

// iniciar servidor
app.listen(process.env.PORT, () => {
  console.log(`Rodando em http://localhost:${process.env.PORT}`);
});