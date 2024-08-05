

import fs from 'fs'
export const removeFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error removing file:', err);
                reject(err);
            } else {
                console.log('Old profile picture file removed:', filePath);
                resolve();
            }
        });
    });
};