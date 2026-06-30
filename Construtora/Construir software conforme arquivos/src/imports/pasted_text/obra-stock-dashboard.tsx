Atue como um web designer e programador sênior, especialista em criação de sistemas web modernos, responsivos e profissionais, com foco em usabilidade, experiência do usuário, organização visual e desenvolvimento em HTML, CSS e JavaScript puro.

CONTEXTO:

Preciso desenvolver um software para resolver um problema real de controle de almoxarifado em construtoras. As empresas analisadas são a EFA Oliva e a Santa Angela, duas grandes construtoras que atualmente fazem o controle de materiais de forma manual, usando caderninho. Elas conseguem anotar o que entra no estoque, mas não possuem um controle eficiente sobre o que sai, quem retirou, para onde foi, se o material foi usado, perdido, devolvido ou danificado.

O principal problema é a falta de rastreabilidade e responsabilidade sobre os materiais retirados. Por exemplo, um funcionário pode retirar dois discos de cortar piso pela manhã, subir para trabalhar em um apartamento no 23º andar e, uma hora depois, voltar ao almoxarifado dizendo que perdeu o material. Como o item não é de alto valor individual, parece algo pequeno, mas quando esse desperdício é multiplicado pela quantidade de apartamentos, prédios e funcionários, o prejuízo se torna muito alto.

Além disso, o almoxarifado de uma obra é sazonal, pois em cada fase da construção os materiais necessários mudam. Na fundação, estrutura, alvenaria, instalações elétricas e hidráulicas, acabamento e entrega da obra, a demanda por materiais é diferente. Também existem diferentes tipos de almoxarifado, como almoxarifado central, almoxarifado da obra e almoxarifado por frente de serviço. Atualmente, as construtoras não possuem estoque de segurança, não controlam perdas e precisam comprar novamente muitos materiais que desaparecem ou são mal utilizados.

A solução proposta é criar um sistema chamado “ObraStock — Controle Inteligente de Almoxarifado”, voltado para o controle de estoque, retirada, devolução e responsabilidade dos materiais em obras. O sistema deve utilizar SKU para identificar cada produto, crachá com código de barras ou QR Code para identificar cada funcionário, controle de kits de ferramentas, checklist de entrega e devolução, estoque de segurança, alertas automáticos e relatórios de perdas.

O objetivo principal do software é substituir o controle manual por um sistema digital que permita saber exatamente: qual material entrou, qual material saiu, quem retirou, em qual quantidade, para qual obra, torre, andar ou apartamento, se o item precisa ser devolvido, se foi consumido, perdido ou danificado.

TAREFA:

Crie um sistema web completo, moderno, profissional e responsivo para controle de almoxarifado de construtoras, chamado “ObraStock — Controle Inteligente de Almoxarifado”.

O sistema deve ter visual corporativo, limpo, intuitivo e tecnológico, adequado para grandes construtoras. Use uma identidade visual ligada à construção civil, estoque e gestão, com tons de azul, cinza, branco e detalhes em laranja ou amarelo para alertas. O layout deve ter menu lateral fixo, cabeçalho, cards de indicadores, tabelas organizadas, botões arredondados, filtros, busca, modais ou painéis laterais para cadastro e telas bem distribuídas.

O sistema deve funcionar como uma SPA, ou seja, o menu lateral deve trocar o conteúdo principal sem recarregar a página.

Crie as seguintes telas/módulos:

1. LOGIN

* Tela inicial com nome do sistema.
* Campos de usuário e senha.
* Botão de entrar.
* Visual profissional, com imagem ou ilustração relacionada à construção civil/almoxarifado.

2. DASHBOARD

* Cards com indicadores principais:

  * Total de produtos cadastrados.
  * Total de materiais em estoque.
  * Materiais com estoque baixo.
  * Materiais retirados no dia.
  * Materiais pendentes de devolução.
  * Valor estimado de perdas.
  * Funcionários com mais retiradas.
  * Obras com maior consumo.
* Gráficos simples e modernos:

  * Gráfico de barras dos materiais mais retirados.
  * Gráfico de pizza ou rosca das perdas por categoria.
  * Gráfico de linha mostrando consumo mensal.
* Área de alertas com estoque crítico, devoluções atrasadas e retiradas repetidas.

3. CADASTRO DE PRODUTOS / SKU

* Tela para cadastrar, editar e excluir produtos.
* Campos:

  * Nome do produto.
  * SKU.
  * Categoria.
  * Unidade de medida.
  * Valor unitário.
  * Fornecedor.
  * Estoque atual.
  * Estoque mínimo.
  * Estoque de segurança.
  * Localização no almoxarifado.
  * Tipo de item: consumível ou devolutivo.
  * Fase da obra em que é mais usado.
* Exibir tabela com os produtos cadastrados.
* Usar etiquetas de status:

  * Verde: estoque adequado.
  * Amarelo: atenção.
  * Vermelho: estoque crítico.

4. CADASTRO DE FUNCIONÁRIOS

* Tela para cadastrar funcionários e responsáveis.
* Campos:

  * Nome completo.
  * Cargo/função.
  * Empresa ou terceirizada.
  * Número do crachá.
  * Código de barras ou QR Code simulado.
  * Status: ativo ou inativo.
* Mostrar histórico de retiradas por funcionário.
* Permitir visualizar pendências de devolução.

5. CADASTRO DE OBRAS E ALMOXARIFADOS

* Tela para cadastrar obras, torres, andares e apartamentos.
* Campos:

  * Nome da obra.
  * Endereço.
  * Torre/prédio.
  * Andar.
  * Apartamento/local de uso.
  * Fase atual da obra.
* Cadastro de três tipos de almoxarifado:

  * Almoxarifado Central.
  * Almoxarifado da Obra.
  * Almoxarifado por Frente de Serviço.
* Permitir transferência de materiais entre almoxarifados.

6. ENTRADA DE MATERIAIS

* Tela para registrar entrada de materiais no estoque.
* Campos:

  * Data de entrada.
  * Produto/SKU.
  * Quantidade recebida.
  * Fornecedor.
  * Nota fiscal.
  * Valor total.
  * Almoxarifado de destino.
  * Responsável pelo recebimento.
* Atualizar automaticamente o estoque do produto.
* Exibir histórico de entradas.

7. RETIRADA DE MATERIAIS POR CRACHÁ

* Tela principal do sistema.
* Simular leitura de crachá por código de barras ou QR Code.
* Ao informar o crachá, o sistema deve identificar o funcionário.
* Campos da retirada:

  * Funcionário responsável.
  * Produto/SKU.
  * Quantidade retirada.
  * Obra.
  * Torre.
  * Andar.
  * Apartamento/local de uso.
  * Tipo de item: consumível ou devolutivo.
  * Justificativa da retirada.
  * Data e horário automático.
* O sistema deve vincular o material ao funcionário.
* Caso o funcionário tente retirar o mesmo item várias vezes no mesmo dia, exibir alerta:
  “Atenção: este funcionário já retirou este material hoje. Deseja continuar?”
* Criar botão de confirmação com termo de responsabilidade:
  “Declaro que recebi os materiais acima e sou responsável pela utilização correta e devolução dos itens devolutivos.”

8. DEVOLUÇÃO DE MATERIAIS

* Tela para registrar devolução de ferramentas e itens devolutivos.
* Campos:

  * Funcionário.
  * Produto ou kit.
  * Data de retirada.
  * Data de devolução.
  * Estado do item:

    * Devolvido em bom estado.
    * Devolvido danificado.
    * Perdido.
    * Não devolvido.
  * Observação.
* Atualizar status da retirada.
* Permitir anexar uma imagem simulada ou botão de “registrar foto” para itens danificados.

9. KITS DE FERRAMENTAS

* Tela para criação e controle de kits.
* Permitir criar kits por função:

  * Kit Pedreiro.
  * Kit Azulejista.
  * Kit Eletricista.
  * Kit Hidráulico.
  * Kit Pintor.
* Cada kit deve conter lista de itens.
* Criar checklist de entrega e devolução.
* Exemplo de checklist:

  * Item entregue.
  * Quantidade entregue.
  * Item devolvido.
  * Estado do item.
  * Observação.
* Mostrar status do kit:

  * Completo.
  * Incompleto.
  * Com item danificado.
  * Pendente de devolução.

10. FASES DA OBRA

* Tela para controlar materiais por fase da construção.
* Fases:

  * Fundação.
  * Estrutura.
  * Alvenaria.
  * Instalações elétricas.
  * Instalações hidráulicas.
  * Acabamento.
  * Entrega da obra.
* Para cada fase, mostrar materiais mais utilizados e estoque recomendado.
* O sistema deve sugerir materiais necessários conforme a fase selecionada.

11. ESTOQUE DE SEGURANÇA E ALERTAS

* Tela com lista de produtos abaixo do estoque mínimo.
* Alertas automáticos:

  * Estoque crítico.
  * Estoque de atenção.
  * Devolução atrasada.
  * Retirada repetida.
  * Material perdido.
* Mostrar sugestão de compra:
  “Produto abaixo do estoque de segurança. Recomenda-se nova compra.”

12. RELATÓRIOS

* Criar relatórios visuais e organizados:

  * Relatório de retiradas por funcionário.
  * Relatório de perdas por produto.
  * Relatório de materiais mais consumidos.
  * Relatório por obra, torre, andar ou apartamento.
  * Relatório de devoluções pendentes.
  * Relatório financeiro de prejuízos.
* Permitir filtros por período, obra, funcionário, produto e categoria.
* Criar botão de imprimir relatório.

13. HISTÓRICO DE MOVIMENTAÇÕES

* Tela com todas as movimentações:

  * Entrada.
  * Saída.
  * Devolução.
  * Perda.
  * Transferência entre almoxarifados.
* Cada movimentação deve mostrar:

  * Data.
  * Tipo.
  * Produto.
  * Quantidade.
  * Funcionário/responsável.
  * Obra/local.
  * Status.

FUNCIONALIDADES IMPORTANTES:

* O sistema deve salvar os dados no localStorage.
* Deve permitir adicionar, editar e excluir registros.
* Deve ter busca e filtros nas tabelas.
* Deve ter dados iniciais simulados para demonstração.
* Deve permitir restaurar dados iniciais.
* Deve ter botões de exportar JSON e importar JSON.
* Deve ter botão de imprimir relatório.
* Deve ter alertas visuais modernos.
* Deve ser responsivo para desktop, tablet e celular.
* Deve ter interface simples para uso no almoxarifado.
* Deve simular leitura de crachá e SKU, mesmo que seja digitando o código em um campo.
* Deve diferenciar materiais consumíveis de materiais devolutivos.
* Deve impedir retirada quando não houver estoque suficiente.
* Deve atualizar o estoque automaticamente após entradas, retiradas, devoluções e perdas.

FORMATO:

Desenvolva o sistema em HTML, CSS e JavaScript puro, sem backend e sem banco de dados externo. O projeto deve conter os arquivos separados:

* index.html
* style.css
* script.js

Pode utilizar Chart.js via CDN para os gráficos.

O código deve ser organizado, comentado e funcional. O sistema deve abrir diretamente pelo arquivo index.html. O visual deve ser moderno, profissional, corporativo e adequado para apresentação acadêmica e demonstração prática.

Crie uma experiência completa, como se fosse um protótipo funcional de um software real para construtoras, com foco em controle de estoque, rastreabilidade, responsabilidade dos funcionários e redução de desperdícios no almoxarifado de obras.
