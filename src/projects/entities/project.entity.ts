import { Column, Entity, PrimaryColumn } from 'typeorm';
import crypto from 'crypto';

export enum ProjectsStatus {
  Pending = 'pending',
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

@Entity()
export class Project {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: 'datetime' })
  started_at: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  cancelled_at: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  finished_at: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  forecasted_at: Date | null;

  @Column({ type: 'simple-enum' })
  status: ProjectsStatus = ProjectsStatus.Pending;

  constructor(
    props: {
      name: string;
      description: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string,
  ) {
    Object.assign(this, props);
    this.id = id ?? crypto.randomUUID();

    if (props?.started_at) {
      this.start(props.started_at);
    }
  }

  start(started_at: Date) {
    if (this.status === ProjectsStatus.Active) {
      throw new Error('Cannot start activated project');
    }

    if (this.status === ProjectsStatus.Completed) {
      throw new Error('Cannot start completed project');
    }

    if (this.status === ProjectsStatus.Cancelled) {
      throw new Error('Cannot start cancelled project');
    }

    this.started_at = started_at;
    this.status = ProjectsStatus.Active;
  }
}