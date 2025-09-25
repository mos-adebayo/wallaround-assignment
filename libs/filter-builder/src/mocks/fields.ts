import { Field } from "../types";

export const mockFields: Field[] = [
  { value: "name", label: "Name", type: "text" },
  { value: "amount", label: "Amount", type: "number" },
  {
    value: "country",
    label: "Country",
    type: "select",
    options: [
      { value: "nigeria", label: "Nigeria" },
      { value: "germany", label: "Germany" },
    ],
  },
];
