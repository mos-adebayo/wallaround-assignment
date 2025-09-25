import { Field } from "../types";

export const mockFields: Field[] = [
  { value: "name", label: "Name", type: "text" },
  { value: "amount", label: "Amount", type: "number" },
  {
    value: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];
