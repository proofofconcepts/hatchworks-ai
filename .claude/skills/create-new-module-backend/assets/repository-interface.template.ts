// TODO: replace these interfaces with the actual fields for this module

export interface Create{ModuleName}Data {
  userId: string;
  // TODO: add fields
}

export interface {ModuleName}Record {
  id: string;
  userId: string;
  createdAt: Date;
  // TODO: add fields
}

export const {MODULE_NAME}_REPOSITORY = Symbol('I{ModuleName}Repository');

export interface I{ModuleName}Repository {
  save(data: Create{ModuleName}Data): Promise<{ModuleName}Record>;
}
