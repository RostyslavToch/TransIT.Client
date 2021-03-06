import { Issue } from './issue';
import { State } from './state';
import { ActionType } from './action-type';
import { Supplier } from './supplier';
import { TEntity } from '../../core/models/entity/entity';

export class IssueLog extends TEntity<IssueLog> {
  description: string;
  expenses: number;
  actionType: ActionType;
  issue: Issue;
  newState: State;
  oldState: State;
  supplier: Supplier;
  modDate: Date;
  createDate: Date;

  constructor(issueLog: Partial<IssueLog>) {
    super(issueLog);
    this.oldState = new State(this.oldState);
    this.newState = new State(this.newState);
    this.actionType = new ActionType(this.actionType);
    this.supplier = new Supplier(this.supplier);
  }
}
