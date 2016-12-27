class NegociacaoController {

    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');
        this._mensagem = new Bind(new Mensagem(), new MensagemView($("#mensagemView")), 'texto');
        this._service = new NegociacaoService();
        this._ordemAtual = '';

        ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes => negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => this._mensagem.texto = erro);

    }


    adiciona(event) {

        event.preventDefault();

        ConnectionFactory.getConnection()
            .then(connection => {
                let negociacao = this._criarNegociacao();
                new NegociacaoDao(connection).adiciona(negociacao).then(() =>{
                    this._listaNegociacoes.adiciona(negociacao);
                    this._mensagem.texto = "Negociação adicionada com sucesso";
                    this._limpaFormulario();
                })
            })
            .catch(erro => this._mensagem.texto = erro);
        /*let negociacao = this._criarNegociacao();
        this._service.salvarNegociacao(negociacao)
            .then(response => {
                console.log(response);
                this._mensagem.texto = response
            })
            .catch(erro => this._mensagem.texto = erro);
        //this._listaNegociacoes.adiciona();
        //this._mensagem.texto = "Negociação adicionada com sucesso!";
        this._limpaFormulario();*/

    }

    apaga() {
        ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = mensagem;
            })
            .catch(erro => this._mensagem.texto = erro);


    }

    importaNegociacoes() {
        this._service.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !this._listaNegociacoes.negociacoes.some(negociacaoExistente =>
                        JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente))
            ))
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'
            }))
            .catch(erro => this._mensagem.texto = erro);
    }

    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

    _criarNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();

    }
}