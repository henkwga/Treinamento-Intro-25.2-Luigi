import { ZodError } from "zod";

export type Issue = { path: string; message: string };

export function badRequest(issues: Issue[]) {
  return Response.json({ message: "Erro de validação", errors: issues }, { status: 400 });
}

export function toIssues(err: unknown): Issue[] {
  if (err instanceof ZodError) {
    return err.issues.map(i => ({ path: i.path.join("."), message: i.message }));
  }
  return [{ path: "", message: "Payload inválido" }];
}
