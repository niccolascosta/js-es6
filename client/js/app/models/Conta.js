class Conta{

    constructor(saldo){
        this._saldo = saldo;
    }

    atualiza(taxa){
        throw new Error("O método atualiza deve ser implementado");
    }

    get saldo(){
        return this._saldo;
    }
}
