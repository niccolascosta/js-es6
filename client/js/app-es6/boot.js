import {} from './polyfill/fetch';
import {currentInstance} from "./controllers/NegociacaoController";

let negociacaoController = currentInstance();
document.querySelector('.form').onsubmit = negociacaoController.adiciona.bind(negociacaoController);
document.querySelector('#apaga').onclick = negociacaoController.apaga.bind(negociacaoController);

