describe("Test for maintenance message (maintenanceMode=true)", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3000/api/maintenance", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          maintenanceMode: "true",
        },
      });
    });
    cy.visit("http://localhost:3000");
  });

  it("Check if the maintenance message is displayed", () => {
    cy.get(".MuiBackdrop-root > .MuiBox-root").should("exist");
  });
});

describe("Test for maintenance message (maintenanceMode=false)", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3000/api/maintenance", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          maintenanceMode: "false",
        },
      });
    });
    cy.visit("http://localhost:3000");
  });

  it("Check if the maintenance message is not displayed", () => {
    cy.get(".MuiBackdrop-root > .MuiBox-root").should("not.exist");
  });
});
