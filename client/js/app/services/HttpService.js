class HttpService {

    get(url) {
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
    }

    post(url, dado) {
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
    }

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