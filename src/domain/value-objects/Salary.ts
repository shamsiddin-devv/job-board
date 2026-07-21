import { JOB_MESSAGES } from '../constants/message';
import { CurrencyType } from '../entities/Job';
import { ValidationError } from '../errors/ValidationError';

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
    if (props.min !== undefined && props.min < 0) {
      throw new ValidationError(JOB_MESSAGES.SALARY_NEGATIVE);
    }

    if (props.max !== undefined && props.max < 0) {
      throw new ValidationError(JOB_MESSAGES.SALARY_NEGATIVE);
    }

    if (props.min !== undefined && props.max !== undefined) {
      if (props.min > props.max) {
        throw new ValidationError(JOB_MESSAGES.SALARY_HIGHER);
      }
    }

    this._max = props.max;
    this._min = props.min;
    this._currency = props.currency;
  }

  equals(others: SalaryRange): boolean {
    return (
      this._min === others._min &&
      this._max === others._max &&
      this._currency === others._currency
    );
  }

  display(): string | void {
    if (this._min && this._max) {
      return `${this._min.toLocaleString()} - ${this._max.toLocaleString()} ${this._currency}`;
    }
    if (this._min) {
      return `${this._min.toLocaleString()} ${this._currency}`;
    }
    if (this._max) {
      return `${this._max.toLocaleString()} ${this._currency}`;
    };
  };

  get min() {return this._min}
  get max() {return this._max}
  get currency() {return this._currency}
}
