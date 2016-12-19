class ListaNegociacoes{

    constructor(armadilha){
        this._negociacoes = [];
    }

    /*constructor(contexto, armadilha){
        this._negociacoes = [];
        this._armadilha = armadilha;
        this._contexto = contexto;
    }*/

    adiciona(negociacao){
        this._negociacoes.push(negociacao);
        /*Reflect.apply(this._armadilha, this._contexto, [this]);*/
    }

    get negociacoes(){
        return [].concat(this._negociacoes);
    }

    get volumeTotal() {
        return this._negociacoes.reduce((total, negociacao) => total + negociacao.volume, 0.0);
    }

    esvazia(){
        this._negociacoes = [];
        /*Reflect.apply(this._armadilha, this._contexto, [this]);*/
    }
}