export class HttpService {

    /*  requisição com XMLHttpRequest();
        get(url) {r
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        console.log(xhr.responseText);
                        reject(xhr.responseText);
                    }
                }
            }
            xhr.send();
        })
    }*/

    _handleErrors(res){
        if(!res.ok) throw new Error(res.statusText);
        return res;
    }

    get(url){

        return fetch(url)
            .then(res => this._handleErrors(res))
            .then(res => res.json());

    }

    post(url, dado){
        return fetch(url, {
            headers: {'Content-type' : 'application/json'},
            method: 'post',
            body: JSON.stringify(dado, this._replacer)
            })
            .then(res => this._handleErrors(res))
    }

    /*post(url, dado) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify(dado, this._replacer));
        });
    }*/

    _replacer(key, value) {
        if (value && typeof value === 'object'){
            var replacement = {};
            for (var k in value) {
                replacement[k.replace('_', '')] = value[k];
            }
            return replacement;
        }
        return value;
    }


}