// api.js
const BASE_URL = "http://newserver:46597/quiX/ControllerV1";
const API_KEY = "quix717244";

const buildQueryParams = (params) =>
  Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== "" && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

export const getSuppliers = async ({ supplierNos, routeNos, headings } = {}) => {
  const query = {
    k: API_KEY,
    s: supplierNos,    // e.g. "00001,00002" or "00001~00005"
    r: routeNos,       // e.g. "23,24"
    h: headings        // e.g. "1,2,3,5"
  };
  const url = `${BASE_URL}/supdata?${buildQueryParams(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch supplier data");
  return response.json();
};

export const getLeafRecords = async ({ dateRange, supplierNos, leafTypes, routeNos,      } = {}) => {
  const query = {
    k: API_KEY,
    d: dateRange,      // e.g. "2024-06-01~2024-06-30"
    s: supplierNos,    // optional
    t: leafTypes,      // optional
    r: routeNos,       // optional
    h: headings        // e.g. "1,2,4,8"
  };
  const url = `${BASE_URL}/glfdata?${buildQueryParams(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch leaf records");
  return response.json();
};

export const getIssueRecords = async ({ dateRange, supplierNos, issueTypes, headings } = {}) => {
  const query = {
    k: API_KEY,
    d: dateRange,      // e.g. "2024-06-01~2024-06-30"
    s: supplierNos,    // optional
    t: issueTypes,     // optional
    h: headings        // e.g. "1,2,3,4"
  };
  const url = `${BASE_URL}/isudata?${buildQueryParams(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch issue records");
  return response.json();
};
