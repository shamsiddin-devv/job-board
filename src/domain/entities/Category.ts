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
      throw new BadRequestError('Name is required.');
    };

    if(!props.slug && props.slug === '') {
      throw new BadRequestError('Slug is required.');
    };
  };

  get id() {return this.props.id};
  get name() {return this.props.name};
  get slug() {return this.props.slug};
  get icon() {return this.props.icon};
  get createdAt() {return this.props.createdAt};
};