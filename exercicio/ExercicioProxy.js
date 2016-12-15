let funcionarioProxy = new Proxy(new Funcionario("niccolas.costa@gmail.com"), {
    get(target, prop, receiver){
        console.log("Armadilha aqui");
        return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver){
      console.log(`Entrou no valor do target: ${target[prop]} valor á receber ${value}`);
      //As duas formas de fazer a mesma coisa.
      target[prop] = value;
      return Reflect.set(target, prop, value, receiver);
    }
});

console.log(funcionarioProxy.email);