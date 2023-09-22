/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/


const getList = async () => {
    let url = 'http://127.0.0.1:5000/registros';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.registros.forEach(item => insertList(item.titulo, item.descricao, item.data_registro))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()

  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (titulo, descricao, imagem, data_registro) => {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('imagem', imagem);
    formData.append('data_registro', data_registro);
  
    let url = 'http://127.0.0.1:5000/registro';
    fetch(url, {
      method: 'post',
      body: formData
    })      
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        let id = div.id.split("-").slice(-1).toString(); 
        row_detalhe = document.getElementById("row-experiencia-detalhe-".concat(id)) 
        row_detalhe.remove()
        console.log(id)
        const titulo = div.getElementsByTagName('td')[0].innerHTML
        const data_registro = div.getElementsByTagName('td')[1].innerHTML

        console.log(div.id)

        if (confirm("Você tem certeza?")) {
          div.remove()
          document.fin
          deleteItem(titulo, data_registro)
          alert("Removido!")
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (titulo, data_registro) => {
    let url = 'http://127.0.0.1:5000/registro?'.concat("titulo=", titulo, "&", "data_registro=", data_registro);
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com nome, quantidade e valor 
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {
    let titulo = document.getElementById("newTitulo").value;
    let descricao = document.getElementById("newDescricao").value;
    let data_registro = document.getElementById("newDataRegistro").value;
    
    if (data_registro.length === 0){ // inputs com data vazia
      date_aux = new Date()
      data_registro = [date_aux.getDate().toString().padStart(2, '0'), date_aux.getMonth().toString().padStart(2, '0'), date_aux.getFullYear()].join('/')
    }

    /* validações da data */

    insert_data = true

    try {
      const regex = /\d{2}\/\d{2}\/\d{4}/g
      if(RegExp(regex).test(data_registro)){
        var partes_data = data_registro.split("/").map(item => parseInt(item))
                
        data_aux = new Date(partes_data[2], partes_data[1], partes_data[0] )
        data_comp = [data_aux.getDate().toString().padStart(2, '0'), data_aux.getMonth().toString().padStart(2, '0'), data_aux.getFullYear()].join('/')

        if (data_registro !== data_comp)
          throw "Data inválida!"

        if (data_aux > new Date())
          throw "Data inválida, pois está no futuro!"

      }
      else
        throw "Data em formato inválido! Formato esperado: dd/mm/yyyy" 
      
    }catch(e){
      insert_data = false
      alert(e)
    }
    


    if (insert_data){
      postItem(titulo, descricao, "imagem", data_registro)
      insertList(titulo, descricao, data_registro)
      alert("Item adicionado!")
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (titulo, descricao, dataRegistro) => {
    var item_resumo = [titulo, dataRegistro]
    var item_detalhe = [descricao]

    var table = document.getElementById('tabela-experiencias');
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2); // id único para construir as rows

    /* Definição dos ids das rows */ 

    const class_name = "row-experiencia"

    var classe_resumo = class_name.concat("-resumo")
    var id_resumo = classe_resumo.concat("-", id)

    var classe_detalhe = class_name.concat("-detalhe")
    var id_detalhe = classe_detalhe.concat("-", id)

    /* Adiciona row de resumo e suas propriedades */
    
    var row_resumo = table.insertRow();
    row_resumo.className = class_name
    row_resumo.id = id_resumo

    for (var i = 0; i < item_resumo.length; i++) {
      var cel = row_resumo.insertCell(i);
      cel.textContent = item_resumo[i];
      cel.setAttribute("onclick", "toggleRowVisibility".concat("('", id_detalhe, "')"))
    } 

    insertButton(row_resumo.insertCell(-1))
    removeElement()

    //row_resumo.setAttribute("onclick", "toggleRowVisibility".concat("('", id_detalhe, "')"))
    row_resumo.className = classe_resumo

    /* ------ fim da row de resumo ------  */

    /* Adiciona row de detalhe e suas propriedades */
        
    var row_detalhe = table.insertRow();
    row_detalhe.className = class_name
    row_detalhe.id = id_detalhe

    for (var i = 0; i < item_detalhe.length; i++) {

      var cel = row_detalhe.insertCell(i);
      cel.textContent = item_detalhe[i];
      cel.setAttribute("colspan", "3");

      //cel_detalhe.setAttribute("colspan", "2")
    }

    row_detalhe.className = classe_detalhe
    row_detalhe.style.display = 'none';


    /*
    row_detalhe.style.display == ''
    row_detalhe.setAttribute("colspan", "2")
    */
    /* ------ fim da row de detalhe ------  */

    
    document.getElementById("newTitulo").value = "";
    document.getElementById("newDescricao").value = "";
    document.getElementById("newDataRegistro").value = "";
  
    
  }

/* Lógica para mudar ícone do expand/collapse */

  const expand_collapse_icon = document.getElementById("img_expand_collapse");

  expand_collapse_icon.addEventListener("click", function() {

    if (expand_collapse_icon.getAttribute('src').includes("collapse"))
      expand_collapse_icon.src = "img/expand.png";
    else
      expand_collapse_icon.src = "img/collapse.png";

    toggleVisibility("newRegistro")
  });

/* Fim Lógica para mudar ícone do expand/collapse */

  function toggleVisibility(id) {
    var x = document.getElementById(id);
    console.log(x.style.display)
    if (x.style.display === "none" || x.style.display === "") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  function toggleRowVisibility(id) {
    var row = document.getElementById(id);
    state = row.style.display
    
    if (row.style.display == '') 
      row.style.display = 'none';
    else 
       row.style.display = '';
  }
    
    