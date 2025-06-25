const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log('deleteFile error', { err });
            throw err;
        }
    });

};

exports.deleteFile = deleteFile;