export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number }[];
};

export type FieldType = "text" | "number" | "boolean" | "date" | "select";

export type OperatorConfig = Partial<Record<FieldType, string[]>>;

export type Rule = {
  field: string;
  operator: string;
  value?: any;
};

export type Condition = "or" | "and";

export type Group = { and: Array<Rule | Group> } | { or: Array<Rule | Group> };

export type APIConfig = {
  mode: "GET" | "POST";
  endpoint: string;
};

export type FilterBuilderProps = {
  schema: Field[];
  operators: OperatorConfig;
  initial?: Group;
  api: APIConfig;
  onSubmit: (json: Group, qs?: string) => void;
};
