
document.getElementById('meuFormulario').addEventListener('submit', function(e) {
            e.preventDefault();


    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    var checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);

    if (!checkedOne) {
        alert('Por favor, marque pelo menos uma caixa.');
        e.preventDefault(); // Impede o envio do formulário apenas se nenhuma caixa estiver marcada
        return false;
    }
    // Cria um elemento de entrada oculto para a data e hora atual
    var currentDateTimeInput = document.createElement('input');
    currentDateTimeInput.setAttribute('type', 'hidden');
    currentDateTimeInput.setAttribute('name', 'updated_datetime');
    
    // Obtém a data e hora atual no formato AAAA-MM-DD HH:MM:SS
    var now = new Date();
    var datetime = now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0') +
                   ' ' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');
    
    // Define o valor da entrada oculta para a data e hora atual
    currentDateTimeInput.setAttribute('value', datetime);
    
    // Anexa a entrada oculta ao formulário
    this.appendChild(currentDateTimeInput);

    // Prepara os dados do formulário para serem enviados via AJAX
    var formData = new FormData(this);
 var nomeSalvoSucesso = localStorage.getItem('nomeCompleto');
   
    // Exibe a notificação do SweetAlert
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Dados enviados com sucesso',
        text: `${nomeSalvoSucesso}`,
        showConfirmButton: false,
        timer: 2000
    });

// Obtém os valores dos campos do formulário
            
            var retiradaDevolucao = document.getElementById('retirada_devolucao').value;
           
            var coletor = document.getElementById('coletor').value;

           
            // Obtenha os dados salvos no LocalStorage, ou uma lista vazia se não houver dados
            var historico = JSON.parse(localStorage.getItem('historicoFormularios')) || [];

            // Verifique se o coletor já existe na lista
            var index = historico.findIndex(item => item.coletor === coletor);

            if (index !== -1) {
                // Atualiza o item existente
                historico[index] = { coletor, retiradaDevolucao, datetime };
            } else {
                // Adiciona um novo item ao início do array
                historico.unshift({ coletor, retiradaDevolucao, datetime });
            }

            // Se a lista tiver mais de 5 itens, remova o último
            if (historico.length > 5) {
                historico.pop();
            }

            // Salva a lista atualizada no LocalStorage
            localStorage.setItem('historicoFormularios', JSON.stringify(historico));



            var nomeCompleto = document.getElementById('nome_completo').value;
    localStorage.setItem('nomeCompleto', nomeCompleto);

    var setor = document.getElementById('setor').value;
    localStorage.setItem('setor', setor);

   

    var cpd_responsavel = document.getElementById('cpd_responsavel').value;
    localStorage.setItem('cpd_responsavel', cpd_responsavel);


    // Envia os dados do formulário usando fetch
    fetch(this.action, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            console.log('Dados enviados com sucesso!');
                    window.location.reload();
        } else {
            Swal.fire("Houve um erro ao enviar o formulário", "", "error");
        }
    }).catch(error => {
            // Trata qualquer erro que ocorra durante o envio
            Swal.fire("Houve um erro ao enviar o formulário", "", "error");
        });





  // Função para gerar o PDF
            function gerarPDF(dados) {
                const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Adiciona o logo da empresa (substitua 'LOGO_BASE64_OU_URL' pelo seu logo)
  doc.addImage('LOGO_BASE64_OU_URL', 'JPEG', 15, 15, 50, 50);

  // Adiciona o texto do termo de responsabilidade
  doc.setFontSize(11);
  doc.text('Termo de Responsabilidade', 20, 80);
  doc.text('Mediante estes termos,', 20, 90);
  doc.text(document.getElementById('nome_completo').value + ' declara que recebeu e', 20, 100);
  doc.text(20, 110, 'responsabiliza-se pelo uso e conservação do equipamento "Coletor Motorola e Zebra",');
  doc.text(20, 120, 'de propriedade de Mateus Supermercado LTDA – Filial 04-Goiás,');
  doc.text(20, 130, 'pelo prazo de expediente, a contar desta data, e comprometendo-se a devolvê-lo(s)');
  doc.text(20, 140, 'em estado atual até o fim deste prazo.');
  doc.text('Setor: ' + document.getElementById('setor').value, 20, 150);
  doc.text(20, 160, 'Número Coletor: ' + document.getElementById('coletor').value);
  doc.text(20, 170, 'Retirando ou Devolvendo: ' + document.getElementById('retirada_devolucao').value);
  doc.text(20, 180, 'CPD Responsável: ' + document.getElementById('cpd_responsavel').value);
  var equipamentos = document.querySelectorAll('input[name="informações"]:checked');
  var listaEquipamentos = [];
  equipamentos.forEach(function(equipamento) {
    listaEquipamentos.push(equipamento.value);
  });
  doc.text('Equipamentos:', 20, 190);
  doc.text(listaEquipamentos.join(', '), 20, 200);

  // Adiciona a linha para assinatura
  doc.text('Assinatura do Colaborador:', 20, 210);
   doc.text(document.getElementById('nome_completo').value, 20, 214);

  doc.line(20, 215, 190, 215);

  // Adiciona a data
  doc.text('Data: ', 20, 225);
doc.text('Data: ' + obterDataAtual(), 20, 225);
  // Salva o PDF
  doc.save('termo_responsabilidade.pdf');

  function obterDataAtual() {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0 (janeiro = 0)
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
                // Retorna o PDF como Blob
                return doc.output('blob');
            }

            // Função para enviar dados e PDF para o Telegram
            function enviarPDFParaTelegram(dados, pdfBlob) {
                const token = '6594333490:AAHpJBSmR4eb5iDRgeYA9HfyHj0f-l70JDg'; // Substitua pelo seu token do bot
                const chatId = '-1001720604244'; // Substitua pelo ID do chat do grupo

                // Endpoint da API do Telegram para enviar documentos
                const url = `https://api.telegram.org/bot${token}/sendDocument`;

                // Cria um formulário para enviar os dados e o arquivo
                let formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('document', pdfBlob, 'termo_responsabilidade.pdf');
                formData.append('caption', `> ${dados.coletor} foi ${dados.retirada_devolucao}🟠\n\nNome: ${dados.nome_completo}\nSetor: ${dados.setor}\nCPD Responsável: ${dados.cpd_responsavel}`);

           
                // Envia a mensagem e o PDF para o Telegram
                fetch(url, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => console.log('Mensagem e PDF enviados com sucesso:', data))
                .catch(error => console.error('Erro ao enviar mensagem e PDF:', error));
            }

            /// Função para enviar dados do formulário para o bot do Telegram
  function enviarDadosParaTelegram(dados) {
    const token = '6594333490:AAHpJBSmR4eb5iDRgeYA9HfyHj0f-l70JDg'; // Substitua pelo seu token do bot
    const chatId = '-1001720604244'; // Substitua pelo ID do chat do grupo

    // Formata a mensagem conforme o padrão desejado
    const statusColetor = dados.retirada_devolucao === 'Retirado' ? 'foi Retirado 🟠' : 'foi Devolvido ✅';
  const mensagem = `> ${dados.coletor} ${statusColetor}\n\nNome: ${dados.nome_completo}\nSetor:  ${dados.setor}\nCPD Responsável: ${dados.cpd_responsavel}`;

    // Endpoint da API do Telegram para enviar mensagens
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Dados para enviar na requisição
    const data = {
      chat_id: chatId,
      text: mensagem
    };

    // Envia a mensagem para o grupo do Telegram
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Mensagem enviada com sucesso:', data))
    .catch(error => console.error('Erro ao enviar mensagem:', error));
  }
 // Coleta os dados do formulário
            let dadosFormulario = {
                nome_completo: document.getElementById('nome_completo').value,
        setor: document.getElementById('setor').value,
         coletor: document.getElementById('coletor').value,
         retirada_devolucao: document.getElementById('retirada_devolucao').value,
         cpd_responsavel: document.getElementById('cpd_responsavel').value
        };

        var formData = new FormData(this);
  var dados = {
    nome_completo: formData.get('nome_completo'),
    setor: formData.get('setor'),
    coletor: formData.get('coletor'),
    retirada_devolucao: formData.get('retirada_devolucao'),
    cpd_responsavel: formData.get('cpd_responsavel')
  };


    // Verifica se o cliente selecionou "Retirando" para gerar e enviar o PDF
    if (dadosFormulario.retirada_devolucao === 'Retirado') {

        // Gera o PDF
        let pdfBlob = gerarPDF(dadosFormulario);

        // Envia o PDF para o Telegram
        enviarPDFParaTelegram(dadosFormulario, pdfBlob);
    }
    if (dadosFormulario.retirada_devolucao === 'Devolvido') {
       // Sempre envia os dados para o Telegram
    enviarDadosParaTelegram(dados);
    }



});

window.onload = function() {
    exibirAvisoDiario(); // Chama a função do aviso
    exibirNotificasao(); // Chama a função da notificação

    // Seu código existente para verificar e inserir valores salvos
    var nomeCompletoSalvo = localStorage.getItem('nomeCompleto');
    var nomeSetorSalvo = localStorage.getItem('setor');
    var nomeCpdResponsavelSalvo = localStorage.getItem('cpd_responsavel');

    if (nomeCompletoSalvo) {
        document.getElementById('nome_completo').value = nomeCompletoSalvo;
        
    }
    if (nomeSetorSalvo) {
        document.getElementById('setor').value = nomeSetorSalvo;
       
    }
    if (nomeCpdResponsavelSalvo) {
        document.getElementById('cpd_responsavel').value = nomeCpdResponsavelSalvo;
        
        localStorage.removeItem('cpd_responsavel');
    }
};


// Função para exibir o aviso uma vez a cada 24 horas
    function exibirAvisoDiario() {
      var agora = new Date().getTime();
      var ultimoAviso = localStorage.getItem('ultimoAviso');
     

      // Se o último aviso não foi definido ou se já passou 24 horas, exiba o aviso
      if (!ultimoAviso || agora - ultimoAviso >= 24 * 60 * 60 * 1000) {
    const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
  toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "info",
  title: 'Aviso Importante!',
text: 'Por favor, preencha o formulário na retirada e na devolução do coletor.',
});

        // Atualiza o horário do último aviso no localStorage
        localStorage.setItem('ultimoAviso', agora);
      }
    }

    function exibirNotificasao() {
      var agora = new Date().getTime();
      var ultimoAviso = localStorage.getItem('ultimoAviso');
       var nomeSalvo = localStorage.getItem('nomeCompleto');
      var setorSalvo = localStorage.getItem('setor');

      // Se o último aviso não foi definido ou se já passou 24 horas, exiba o aviso
      if (!ultimoAviso || agora - ultimoAviso >= 60 * 1000) {
    iziToast.success({
                    
                    messageColor: '#000000',
                    transitionIn: 'bounceInDown',
                    image: 'https://www.cpdverificationservice.com/uploads/1/2/6/8/126857925/cropped-cpd-logo-clear-1.png',
                    position: 'topRight',
                    title: 'Seus dados foram salvo com sucesso,',
                    message: `${nomeSalvo} ➡️ Setor: ${setorSalvo}!`
                });

        // Atualiza o horário do último aviso no localStorage
        localStorage.setItem('ultimoAviso', agora);
      }
    }
   
        
function toggleCheckboxes(checkbox) {
        var checkboxes = document.getElementsByName('informações');
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = checkbox.checked;
        }
    }
    


  // Função para verificar as seleções e exibir o alerta
function verificarSelecoes() {
  var retiradaDevolucao = document.getElementById('retirada_devolucao').value;
  var cpdResponsavel = document.getElementById('cpd_responsavel').value;
  
  // Verifica se as opções 'Devolvido' e 'Sem_cpd' foram selecionadas
  if (retiradaDevolucao === 'Devolvido' && cpdResponsavel === 'Sem_cpd') {
    // Exibe o alerta
    var alerta = document.getElementById('alertaDevolucao');
    alerta.style.display = 'block';
  } else {
    // Esconde o alerta
    var alerta = document.getElementById('alertaDevolucao');
    alerta.style.display = 'none';
  }
}

// Adiciona o evento de mudança aos selects para chamar a função verificarSelecoes
document.getElementById('retirada_devolucao').addEventListener('change', verificarSelecoes);
document.getElementById('cpd_responsavel').addEventListener('change', verificarSelecoes);

$(document).ready(function() {
            $('.selectpicker').selectpicker();
        });


document.addEventListener('DOMContentLoaded', (event) => {
  const coletorSelect = document.getElementById('coletor');
  const retiradaDevolucaoSelect = document.getElementById('retirada_devolucao');

  // Verifica o estado do coletor no LocalStorage ao carregar a página
  function verificarEstadoColetor() {
    const savedStatus = localStorage.getItem('coletorStatus');
    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      const currentTime = Date.now();
      const timeElapsed = currentTime - status.timestamp;

      // Se o tempo desde a última ação for menor que 5 minutos, impede a ação repetida para o mesmo coletor
      if (timeElapsed < 30 * 1000) {
        
        // Impede a seleção do coletor com ação recente
        const options = coletorSelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === status.coletor) {
            options[i].disabled = true;
            break;
          }
        }
      }
    }
  }

  verificarEstadoColetor();

  retiradaDevolucaoSelect.addEventListener('change', (event) => {
    const acao = event.target.value;
    const coletor = coletorSelect.value;

    // Atualiza o estado no LocalStorage
    localStorage.setItem('coletorStatus', JSON.stringify({
      coletor,
      acao,
      timestamp: Date.now()
    }));

    // Reativa todos os coletores após a seleção
    const options = coletorSelect.options;
    for (let i = 0; i < options.length; i++) {
      options[i].disabled = false;
    }

    // Desativa o coletor por 5 minutos após a ação
    setTimeout(() => {
      const status = JSON.parse(localStorage.getItem('coletorStatus'));
      if (status && status.coletor === coletor && status.acao === acao) {
        localStorage.removeItem('coletorStatus');
        options[coletorSelect.selectedIndex].disabled = false;
      }
    }, 30 * 1000);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const setorSelect = document.getElementById('setor');
  const coletorSelect = document.getElementById('coletor');
  const retiradaDevolucaoSelect = document.getElementById('retirada_devolucao');
 const nome_completoS = document.getElementById('nome_completo');

  function verificarCondicões() {
    const setor = setorSelect.value;
    const retiradaDevolucao = retiradaDevolucaoSelect.value;
    const coletorValue = coletorSelect.value;
    const nome_completo = nome_completoS.value;
    const coletorNumber = coletorValue.match(/\d+/) ? parseInt(coletorValue.match(/\d+/)[0]) : null;

    // Verificar se as condições para Frios, Auditoria ou Prevenção de perdas são atendidas
    if (retiradaDevolucao === 'Retirado' && 
        (setor === 'Frios' || setor === 'Auditoria' || setor === 'Prevencao_de_perdas') &&
        coletorNumber && coletorNumber >= 1 && coletorNumber <= 9 ) {
  const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  title: '⚠️ Atenção!',
  text: ` Este Coletor-${coletorNumber.toString().padStart(2, '0')} é destinado para setor do "Deposito"`,
  icon: 'warning',
});
    }
    
    // Verificar se as condições para Deposito são atendidas
    if (retiradaDevolucao === 'Retirado' && 
        setor === 'Deposito' &&
        coletorNumber && coletorNumber >= 9 && coletorNumber <= 20) {
      const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  title: '⚠️ Atenção!',
  text: ` Este Coletor-${coletorNumber.toString().padStart(2, '0')} é destinado para setor do "Frios","Auditoria", "Prevencao_de_perdas"`,
  icon: 'warning',
});
    }
   
    // Verificar se as condições para Frios, Auditoria ou Prevenção de perdas são atendidas
    if (retiradaDevolucao === 'Devolvido' && 
        (setor === 'Frios' || setor === 'Auditoria' || setor === 'Prevencao_de_perdas' || setor === 'Deposito') &&
        coletorNumber && coletorNumber >= 1 && coletorNumber <= 20) {
  const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  title: `${nome_completo}`,
  text: `Antes de finalizar a devolução, confirme se o número do coletor está correto."      >Coletor- ${coletorNumber.toString().padStart(2, '0')} " `,
  icon: 'info',
});
    }



  }

  // Adicionar ouvintes de evento para todos os selects
  setorSelect.addEventListener('change', verificarCondicões);
  coletorSelect.addEventListener('change', verificarCondicões);
  retiradaDevolucaoSelect.addEventListener('change', verificarCondicões);
});

// Exibe os dados em uma tabela quando o botão for clicado
        const botaoExibirTabela = document.getElementById('exibirTabela');
        const tabelaDados = document.getElementById('tabelaDados');

        //Caso queira exibir tabela apenas se clicar no butao
      //document.getElementById('exibirTabela').addEventListener('click', function() {
            const dadosSalvos = localStorage.getItem('historicoFormularios');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                const tabelaBody = document.querySelector('#tabelaDados tbody');
                
                // Limpe o conteúdo da tabela antes de exibir os novos dados
                tabelaBody.innerHTML = '';

                // Crie uma nova linha na tabela para cada conjunto de dados
                dados.forEach((dado, index) => {
                    const novaLinha = document.createElement('tr');
                    novaLinha.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${dado.coletor}</td>
                        <td class="${dado.retiradaDevolucao === 'Devolvido' ? 'devolvido' : 'retirado'}">${dado.retiradaDevolucao}</td>
                        <td>${dado.datetime}</td>
                    `;
                    tabelaBody.appendChild(novaLinha);
                });

            } else {
                
            }
        //});

        document.getElementById('limparHistorico').addEventListener('click', function() {
            Swal.fire({
                title: 'Você tem certeza?',
                text: "Você não poderá reverter isso!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, limpar!',
                cancelButtonText: 'Não, cancelar!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('historicoFormularios');
                    document.querySelector('#tabelaDados tbody').innerHTML = '';
                    Swal.fire(
                        'Limpo!',
                        'Seu histórico foi limpo.',
                        'success'
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        'Cancelado',
                        'Seu histórico está seguro :)',
                        'error'
                    );
                }
            });
        });

        document.getElementById('gerarRelatorio').addEventListener('click', function() {
            const dadosSalvos = localStorage.getItem('historicoFormularios');
            if (dadosSalvos) {
                Swal.fire({
                    title: 'Escolha o formato do relatório',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'PDF',
                    cancelButtonText: 'XLSX',
                    reverseButtons: true
                }).then((result) => {
                    const dados = JSON.parse(dadosSalvos);
                    if (result.isConfirmed) {
                        gerarRelatorioPDF(dados);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        gerarRelatorioXLSX(dados);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Nenhum dado salvo ainda.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });

        function gerarRelatorioPDF(dados) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text('Relatório de Coletas', 10, 10);

            let linha = 20;
            dados.forEach((dado, index) => {
                doc.text(`${index + 1}. Coletor: ${dado.coletor}, Status: ${dado.retiradaDevolucao}, Data/Hora: ${dado.datetime}`, 10, linha);
                linha += 10;
            });

            doc.save('relatorio_coletas.pdf');
        }

        function gerarRelatorioXLSX(dados) {
            const worksheet = XLSX.utils.json_to_sheet(dados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

            XLSX.writeFile(workbook, 'relatorio_coletas.xlsx');
        }

        var clienteSalvo = localStorage.getItem('nomeCompleto');
    document.getElementById('nomeCliente').textContent = clienteSalvo || 'Cliente'; // Se não houver nome salvo, exibe "Cliente"
