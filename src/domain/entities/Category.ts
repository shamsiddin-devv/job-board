import { CATEGORY_MESSAGES } from "../constants/message"
import { BadRequestError } from "../errors/BadRequestError"

export interface ICategoryProps {
  id?: string
  name: string
  slug: string
  icon?: string
  createdAt?: Date
};

export class Category {
  constructor(private props: ICategoryProps) {
    if(!props.name && props.name.trim() === '') {
      throw new BadRequestError(CATEGORY_MESSAGES.NAME_REQUIRED);
    };

    if(!props.slug && props.slug === '') {
      throw new BadRequestError(CATEGORY_MESSAGES.SLUG_REQUIRED);
    };
  };

  get id() {return this.props.id};
  get name() {return this.props.name};
  get slug() {return this.props.slug};
  get icon() {return this.props.icon};
  get createdAt() {return this.props.createdAt};
};