const { getYnabAccountDetails } = require('./ynab');
const { getFinancialAccountNumbers } = require('../../index');

async function printYnabAccountData() {
  const ynabAccountData = await getYnabAccountDetails();
  const companyIdToAccountNumbers = await getFinancialAccountNumbers();
  console.log();
  console.log();
  console.log('------YNAB Budgets------');
  console.log(ynabAccountData.budgets);
  console.log();
  console.log('------YNAB Accounts------');
  console.log(ynabAccountData.accounts);
  console.log();
  console.log('------Financial institutions account numbers------');
  console.log(companyIdToAccountNumbers);
  console.log();
}

printYnabAccountData();
