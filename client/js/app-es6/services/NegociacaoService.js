import {HttpService} from "./HttpService";
import {ConnectionFactory} from "./ConnectionFactory";
import {NegociacaoDao} from "../dao/NegociacaoDao";
import {Negociacao} from "../models/Negociacao";

export class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoes() {

        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {
            return periodos.reduce((dados, periodo) => dados.concat(periodo), [])
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor));
        }).catch(erro => {
            throw new Error(erro);
        });

    }

    obterNegociacoesDaSemana() {
        return new Promise((resolve, reject) => {
            this._http.get('negociacoes/semana')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(erro => {
                    console.log(erro);
                    reject("Não foi possível obter as negociações da semana");
                });
        });
    }

    obterNegociacoesDaSemanaAnterior() {

        return new Promise((resolve, reject) => {
            this._http.get('negociacoes/anterior')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(erro => {
                    console.log(erro);
                    reject("Não foi possível obter as negociações da semana anterior");
                });
        });

    }

    obterNegociacoesDaSemanaRetrasada() {

        return new Promise((resolve, reject) => {
            this._http.get('negociacoes/retrasada')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(erro => {
                    console.log(erro);
                    reject("Não foi possível obter as negociações da semana retrasada");
                });
        });
    }

    /**
     * Cadastra uma nova negociacao no indexDB.
     * @param negociacao
     */
    cadastra(negociacao) {
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso.')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível adicionar negociação')
            });

    }

    lista(){
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações');
            });
    }

    apaga(){
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso.')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível apagar as negociações');
            });
    }

    importa(listaAtual){
        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente =>
                        negociacao.isEquals(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível buscar/importar negociações.')
            });
    }

    /**
     * Salva uma nova negociacao no servidor.
     * @param negociacao
     * @returns {Promise}
     */
    salvarNegociacao(negociacao) {
        return new Promise((resolve, reject) => {
            this._http.post('negociacoes', negociacao)
                .then(response => resolve(response))
                .catch(erro => {
                    console.log(erro);
                    reject("Nao deu certo adicionar negociacao");
                })

        })
    }
}