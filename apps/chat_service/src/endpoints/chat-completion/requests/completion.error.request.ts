// #/components/schemas/ErrorResponse (23305)
export type OutputRequest_ErrorBody_Type = {
  error: Error_Type
};

// #/components/schemas/Error (23268)
export type Error_Type = {
  code: string | null,
  message: string,
  param: string | null,
  type: string
};



