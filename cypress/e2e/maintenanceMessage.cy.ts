describe("Test for maintenance message", () => {
  it("Check if the maintenance message is displayed", () => {
    cy.visit("http://localhost:3000");

    // si le site est en maintenance alors
    cy.get(".MuiBackdrop-root > .MuiBox-root").should("exist");
  });
});
