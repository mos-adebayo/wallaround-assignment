export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number | boolean }[];
};

export type FieldType = "string" | "number" | "boolean" | "date" | "select";

export type OperatorConfig = Record<FieldType, string[]>;

export type Rule = {
  field: string;
  operator: string;
  value?: any;
};

export type Condition = "or" | "and";

export type Group = { and: Array<Rule | Group> } | { or: Array<Rule | Group> };

export type APIConfig = {
  mode: "GET" | "POST";
  endpoint?: string;
};

export type FilterJSON = Group;

export type FilterBuilderProps = {
  schema: Field[];
  operators: OperatorConfig;
  initial?: FilterJSON;
  api?: APIConfig;
  onChange?: (json: FilterJSON, qs?: string) => void;
};
