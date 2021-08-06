export const bx24methods =  {
    methods: {
        async callMethod(methodName, params) {

            return new Promise(function (resolve, reject) {
               let result = [];
                // eslint-disable-next-line no-undef
                BX24.callMethod(methodName, params, function (response) {
                    if (response.error()){
                        console.error("Ошибка !!! \n"+response.error());
                        reject (response.error())
                    }
                       else {
                        result = result.concat(response.data());
                        if (response.more()) {
                           response.next();
                        }
                        else {
                            resolve(result);
                        }
                    }
                });
            })
        }
    },


};

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }