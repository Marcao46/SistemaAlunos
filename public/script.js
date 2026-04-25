async function cadastrar() {
  const nome = document.getElementById('nome').value;
  const turma = document.getElementById('turma').value;
  const notasTexto = document.getElementById('notas').value;

  if (!nome || !turma || !notasTexto) {
    alert('Preencha todos os campos.');
    return;
  }

  const notas = notasTexto.split(',').map(n => Number(n.trim()));

  await fetch('/api/aluno', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, turma, notas })
  });

  alert('Aluno cadastrado com sucesso!');
  document.getElementById('nome').value = '';
  document.getElementById('turma').value = '';
  document.getElementById('notas').value = '';
}

async function buscar() {
  const turma = document.getElementById('buscaTurma').value;
  const res = await fetch(`/api/alunos/${turma}`);
  const dados = await res.json();

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';

  if (dados.length === 0) {
    resultado.innerHTML = 'Nenhum aluno encontrado.';
    return;
  }

  dados.forEach(aluno => {
    resultado.innerHTML += `
      <div class="card-aluno">
        <strong>${aluno.nome}</strong><br>
        Turma: ${aluno.turma}<br>
        Notas: ${aluno.notas.join(', ')}

        <div class="acoes">
          <button class="btn-editar" onclick="editarAluno('${aluno._id}', '${aluno.nome}', '${aluno.turma}', '${aluno.notas.join(',')}')">Editar</button>
          <button class="btn-excluir" onclick="excluirAluno('${aluno._id}')">Excluir</button>
        </div>
      </div>
    `;
  });
}

async function media() {
  const res = await fetch('/api/media');
  const dados = await res.json();

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';

  if (dados.length === 0) {
    resultado.innerHTML = 'Nenhuma média encontrada.';
    return;
  }

  dados.forEach(item => {
    resultado.innerHTML += `
      <div class="card-media">
        ${item._id} - Média: ${item.media.toFixed(2)}
      </div>
    `;
  });
}

async function excluirAluno(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este aluno?');
  if (!confirmar) return;

  await fetch(`/api/aluno/${id}`, {
    method: 'DELETE'
  });

  alert('Aluno excluído com sucesso!');
  buscar();
}

async function editarAluno(id, nomeAtual, turmaAtual, notasAtuais) {
  const novoNome = prompt('Editar nome:', nomeAtual);
  if (novoNome === null) return;

  const novaTurma = prompt('Editar turma:', turmaAtual);
  if (novaTurma === null) return;

  const novasNotasTexto = prompt('Editar notas (ex: 7,8,9):', notasAtuais);
  if (novasNotasTexto === null) return;

  const notas = novasNotasTexto.split(',').map(n => Number(n.trim()));

  await fetch(`/api/aluno/replace/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: novoNome,
      turma: novaTurma,
      notas: notas
    })
  });

  alert('Aluno editado com sucesso!');
  buscar();
}