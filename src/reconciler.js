class TransactionReconciler {
    constructor(sourceTransactions, systemTransactions) {
        this.sourceTransactions = sourceTransactions;
        this.systemTransactions = systemTransactions;
    }

    reconcile() {
        const sourceMap = new Map();
        const systemMap = new Map();

        this.sourceTransactions.forEach(tx => {
            sourceMap.set(tx.providerTransactionId, tx);
        });

        this.systemTransactions.forEach(tx => {
            systemMap.set(tx.transactionId, tx);
        });

        const missingInInternal = this.findMissingTransactions(sourceMap, systemMap, 'providerTransactionId');
        const missingInSource = this.findMissingTransactions(systemMap, sourceMap, 'transactionId');

        const mismatchedTransactions = this.findMismatchedTransactions(sourceMap, systemMap);

        return {
            missing_in_internal: missingInInternal.map(tx => ({
                providerTransactionId: tx.providerTransactionId,
                amount: tx.amount,
                currency: tx.currency,
                status: tx.status
            })),
            missing_in_source: missingInSource.map(tx => ({
                transactionId: tx.transactionId,
                amount: tx.amount,
                currency: tx.currency,
                status: tx.status
            })),
            mismatched_transactions: mismatchedTransactions
        };
    }

    findMissingTransactions(primaryMap, secondaryMap, idField) {
        const missing = [];
        for (const [id, tx] of primaryMap) {
            if (!secondaryMap.has(id)) {
                missing.push(tx);
            }
        }
        return missing;
    }

    findMismatchedTransactions(sourceMap, systemMap) {
        const mismatched = [];

        for (const [id, sourceTx] of sourceMap) {
            if (systemMap.has(id)) {
                const systemTx = systemMap.get(id);
                const discrepancies = {};

                // not use sourceTx.amount !== systemTx.amount because of floating point precision
                if (Math.abs(sourceTx.amount - systemTx.amount) > 0.001) {
                    discrepancies.amount = {
                        source: sourceTx.amount,
                        system: systemTx.amount
                    };
                }

                if (sourceTx.status !== systemTx.status) {
                    discrepancies.status = {
                        source: sourceTx.status,
                        system: systemTx.status
                    };
                }

                if (Object.keys(discrepancies).length > 0) {
                    mismatched.push({
                        transactionId: id,
                        discrepancies
                    });
                }
            }
        }

        return mismatched;
    }
}

module.exports = TransactionReconciler;