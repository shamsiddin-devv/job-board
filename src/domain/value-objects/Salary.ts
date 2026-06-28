import { CurrencyType } from '../entities/Job';

export interface ISalaryRangeProps {
  min?: number;
  max?: number;
  currency: CurrencyType;
}

export class SalaryRange {
  private readonly _min: number | undefined;
  private readonly _max: number | undefined;
  private readonly _currency: CurrencyType;

  constructor(props: ISalaryRangeProps) {
    
  }
}
