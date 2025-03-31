# Transaction Reconciliation Service

A robust service designed to reconcile transactions between external payment providers and internal systems. This service helps identify discrepancies, missing transactions, and data mismatches between two transaction sources.

## Features

- Efficient transaction reconciliation using Map-based lookups
- Handles floating-point precision issues in amount comparisons
- Generates detailed JSON reports of reconciliation results
- Supports CSV file input from multiple sources
- Asynchronous file processing for better performance

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone <(https://github.com/Rophael/reconciliation-service)>
cd reconciliation-service
```

2. Install dependencies:

```bash
npm install
```

## Usage

1. Place your CSV files in the `/data` directory:

   - `source_transactions.csv` (external provider data)
   - `system_transactions.csv` (internal system data)

2. Run the reconciliation service:

```bash
npm start
```

3. View the reconciliation report in `/output/reconciliation_report.json`

## Output Format

The service generates a JSON report containing:

- `missing_in_internal`: Transactions present in source but missing in internal system
- `missing_in_source`: Transactions present in internal system but missing in source
- `mismatched_transactions`: Transactions with discrepancies in amount or status

## Technical Design Rationale

### Architecture

1. **Modular Design**

   - Separated concerns into distinct modules (CSV parsing, reconciliation logic)
   - Each module has a single responsibility
   - Easy to extend and maintain

2. **Data Processing**

   - Uses Map data structure for O(1) lookups during reconciliation
   - Asynchronous CSV parsing for better performance
   - Handles large datasets efficiently

3. **Error Handling**

   - Comprehensive error handling for file operations
   - Graceful error reporting
   - Process exit on critical errors

4. **Type Safety**
   - Explicit type conversion for numeric fields
   - Consistent data structure across modules
   - Clear interface definitions

### Performance Considerations

- Map-based lookups for O(1) transaction matching
- Asynchronous file processing
- Memory-efficient streaming of CSV files
- Minimal data duplication

## Code Review Notes

### Strengths

1. **Efficient Data Structures**

   - Uses Map for O(1) lookups
   - Minimizes memory usage
   - Optimized for large datasets

2. **Robust Error Handling**

   - Comprehensive try-catch blocks
   - Clear error messages
   - Graceful failure handling

3. **Clean Code Structure**

   - Well-organized modules
   - Clear separation of concerns
   - Consistent coding style

4. **Precision Handling**
   - Smart handling of floating-point comparisons
   - Uses threshold for amount comparisons
   - Prevents false positives

### Areas for Improvement

1. **Configuration Management**

   - Consider moving hardcoded values to config file
   - Add support for custom comparison thresholds
   - Make file paths configurable

2. **Input Validation**

   - Add schema validation for CSV files
   - Implement data type checking
   - Add support for custom field mappings

3. **Testing Coverage**

   - Add more unit tests
   - Include integration tests
   - Add performance benchmarks

4. **Documentation**
   - Add JSDoc comments
   - Include API documentation
   - Add more usage examples
