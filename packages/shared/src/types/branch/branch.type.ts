export type TransactionResponse = {
  id: number;
  pensioner_id: number;
  firstname: string;
  lastname: string;
  term: number;
  loan_amount: number;
  processing_fee: number;
};


export type TransactionFormValues = {
  pensioner_id: number;
  term: number;
  loan_amount: number;
  processing_fee: number;
};