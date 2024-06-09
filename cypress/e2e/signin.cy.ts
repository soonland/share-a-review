describe("Feature: Signin Page", () => {
  beforeEach(() => {
    cy.visit("/api/auth/signin");
    cy.contains("Sign in with Google").should("be.visible");
    cy.contains("Sign in with Spotify").should("be.visible");
  });

  context("Scenario: Displaying login buttons", () => {
    it("Given the user visits the signin page, then the Google login button should be visible", () => {
      cy.contains("button", "Sign in with Google").should("be.visible");
    });

    it("And the Spotify login button should be visible", () => {
      cy.contains("button", "Sign in with Spotify").should("be.visible");
    });
  });

  context("Scenario: Redirecting to authentication providers", () => {
    it("When the user clicks the Google login button, then they should be redirected to Google login", () => {
      cy.intercept("GET", "**/accounts.google.com/**", {
        statusCode: 200,
        // headers: { Location: "https://accounts.google.com" },
      }).as("googleLogin");
      cy.contains("button", "Sign in with Google").click();
      cy.wait("@googleLogin");
    });

    it("When the user clicks the Spotify login button, then they should be redirected to Spotify login", () => {
      cy.intercept("GET", "**/accounts.spotify.com/**", {
        statusCode: 200,
        // headers: { Location: "https://accounts.spotify.com" },
      }).as("spotifyLogin");
      cy.contains("button", "Sign in with Spotify").click();
      cy.wait("@spotifyLogin");
    });

    it("When the user enters an email and password, then they should be redirected to the dashboard", () => {
      cy.get("input[name=email]").type("");
      cy.get("input[name=password]").type("");
      cy.contains("button", "Sign in with Credentials").click();
      cy.url().should("include", "/dashboard");
    });
  });

  // context("Scenario: Successful login with Google", () => {
  //   it("Given the user clicks the Google login button, when authenticated, then they should be redirected to the dashboard", () => {
  //     cy.login("google");
  //     cy.url().should("include", "/dashboard");
  //   });
  // });

  // context("Scenario: Successful login with Spotify", () => {
  //   it("Given the user clicks the Spotify login button, when authenticated, then they should be redirected to the dashboard", () => {
  //     cy.login("spotify");
  //     cy.url().should("include", "/dashboard");
  //   });
  // });
});
