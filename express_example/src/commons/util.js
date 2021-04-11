const fs = require('fs');

// The role is a not-nullable enum attribute with the following possible values:
// admin and customer. The default value of this field is “customer”. Define these values as constants in the utils.js file.


const role = {
    'admin': 'admin', 
    'customer': 'customer',   
} 



module.exports = {
    writeInFile(content) {
        return new Promise((resolve) => {
            fs.writeFile('content.txt', content, {encoding: 'utf-8'}, () => {
                resolve();
            });
        })
    },


    
    readFromFile() {
        return new Promise((resolve, reject) => {
            fs.readFile('content.txt', (err, data) => {
                if(err) {
                    return reject(err);
                }

                resolve(data);
            });
        });
    },
    role,
}




