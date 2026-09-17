export type TransactionResponse = {
  id: number;
  pensioner_id: string;
  firstname: string;
  lastname: string;
  term: number;
  loan_amount: number;
  processing_fee: number;
};


export type TransactionFormValues = {
  pensioner_id: string;
  term: number;
  loan_amount: number;
  processing_fee: number;
};