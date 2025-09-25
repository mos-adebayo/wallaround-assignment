import { Group } from "../types";
import { serializeToQueryString } from "./serializer";

export const postAction = async (url: string, payload: Group) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return;
  }

  return res.json();
};

export const getAction = async (url: string, payload: Group) => {
  const queryString = serializeToQueryString(payload);
  const res = await fetch(`${url}?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return;
  }

  return res.json();
};
