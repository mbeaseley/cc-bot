export type PermissionType = 'USER' | 'ROLE';

export class Permission {
  id: string;
  type: PermissionType;

  constructor(id: string, type: PermissionType) {
    this.id = id;
    this.type = type;
  }
}
