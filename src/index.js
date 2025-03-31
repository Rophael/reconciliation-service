const path = require('path');
const { parseCSV } = require('./csvParser');
const TransactionReconciler = require('./reconciler');
const fs = require('fs');

async function main() {
    try {
        const outputDir = path.join(__dirname, '../output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }


        const [sourceTransactions, systemTransactions] = await Promise.all([
            parseCSV(path.join(__dirname, '../data/source_transactions.csv')),
            parseCSV(path.join(__dirname, '../data/system_transactions.csv'))
        ]);


        const reconciler = new TransactionReconciler(sourceTransactions, systemTransactions);
        const result = reconciler.reconcile();


        const outputPath = path.join(outputDir, 'reconciliation_report.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error('Error during reconciliation:', error);
        process.exit(1);
    }
}

main().catch(console.error);