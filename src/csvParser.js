const fs = require('fs');
const csv = require('csv-parser');

async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const isSource = filePath.includes('source_transactions');
                const transaction = isSource ? {
                    providerTransactionId: data.providerTransactionId,
                    amount: parseFloat(data.amount),
                    currency: data.currency,
                    status: data.status
                } : {
                    transactionId: data.transactionId,
                    amount: parseFloat(data.amount),
                    currency: data.currency,
                    status: data.status
                };
                results.push(transaction);
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

module.exports = { parseCSV };