const reviewMenus = [
  { id: "allReviews", title: "mainMenu.reviewsMenu.allReviews" },
  { id: "movies", title: "mainMenu.reviewsMenu.movies" },
  { id: "books", title: "mainMenu.reviewsMenu.books" },
  { id: "music", title: "mainMenu.reviewsMenu.music" },
  { id: "games", title: "mainMenu.reviewsMenu.games" },
  { id: "products", title: "mainMenu.reviewsMenu.products" },
  { id: "places", title: "mainMenu.reviewsMenu.places" },
  { id: "restaurants", title: "mainMenu.reviewsMenu.restaurants" },
  { id: "recipes", title: "mainMenu.reviewsMenu.recipes" },
  { id: "videos", title: "mainMenu.reviewsMenu.videos" },
  { id: "apps", title: "mainMenu.reviewsMenu.apps" },
  { id: "services", title: "mainMenu.reviewsMenu.services" },
  { id: "events", title: "mainMenu.reviewsMenu.events" },
  { id: "other", title: "mainMenu.reviewsMenu.other" },
];

interface MainMenuItemProps {
  id: string;
  title: string;
  icon?: string;
  subMenus?: { id: string; title: string }[];
}

export const sarMenus: MainMenuItemProps[] = [
  { id: "reviews", title: "mainMenu.reviews", subMenus: reviewMenus, icon: "reviews" },
  { id: "myReviews", title: "mainMenu.myReviews", icon: "myReviews" },
  { id: "writeReview", title: "mainMenu.writeReview", icon: "create" },
];
