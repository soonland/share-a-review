export interface ReviewsMenuItemProps {
  id: string;
  title: string;
  icon?: string;
  url?: string;
}

const reviewMenus: ReviewsMenuItemProps[] = [
  { id: "allReviews", title: "mainMenu.reviewsMenu.allReviews", icon: "RateReview", url: "/reviews" },
  { id: "movies", title: "mainMenu.reviewsMenu.movies", icon: "Movie", url: "/reviews/movies" },
  { id: "electronics", title: "mainMenu.reviewsMenu.electronics", icon: "Movie", url: "/reviews/electronics" },
  { id: "books", title: "mainMenu.reviewsMenu.books", icon: "MenuBook", url: "/reviews/books" },
  { id: "games", title: "mainMenu.reviewsMenu.games", icon: "SportsEsports", url: "/reviews/games" },
  // { id: "products", title: "mainMenu.reviewsMenu.products", icon: "ShoppingCart", url: "/reviews/products" },
  // { id: "places", title: "mainMenu.reviewsMenu.places", icon: "Place", url: "/reviews/places" },
  // { id: "restaurants", title: "mainMenu.reviewsMenu.restaurants", icon: "Restaurant", url: "/reviews/restaurants" },
  // { id: "recipes", title: "mainMenu.reviewsMenu.recipes", icon: "RestaurantMenu", url: "/reviews/recipes" },
  // { id: "videos", title: "mainMenu.reviewsMenu.videos", icon: "VideoLibrary", url: "/reviews/videos" },
  // { id: "apps", title: "mainMenu.reviewsMenu.apps", icon: "Apps", url: "/reviews/apps" },
  // { id: "services", title: "mainMenu.reviewsMenu.services", icon: "Build", url: "/reviews/services" },
  // { id: "events", title: "mainMenu.reviewsMenu.events", icon: "Event", url: "/reviews/events" },
  { id: "other", title: "mainMenu.reviewsMenu.other", icon: "MoreHoriz", url: "/reviews/other" },
];

export interface MainMenuItemProps {
  id: string;
  title: string;
  icon?: string;
  subMenus?: ReviewsMenuItemProps[];
  url?: string;
}

export const sarMenus: MainMenuItemProps[] = [
  { id: "reviews", title: "mainMenu.reviews", subMenus: reviewMenus, icon: "reviews", url: "/reviews" },
  { id: "myReviews", title: "mainMenu.myReviews", icon: "myReviews", url: "/my-reviews" },
  { id: "writeReview", title: "mainMenu.writeReview", icon: "create", url: "/reviews/write-review" },
];
