import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders its content", () => {
    render(<Button>Continuar</Button>);
    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  });

  it("supports variants and asChild links", () => {
    render(<Button variant="outline" asChild><a href="/cadastrar">Cadastrar</a></Button>);
    expect(screen.getByRole("link", { name: "Cadastrar" })).toHaveClass("border-neon");
  });
});
