export interface ReviewsMenuItemProps {
  id: string;
  title: string;
  icon?: string;
  url?: string;
}

const reviewMenus: ReviewsMenuItemProps[] = [
  { id: "allReviews", title: "mainMenu.reviewsMenu.allReviews", icon: "RateReview", url: "/categories" },
  { id: "movies", title: "mainMenu.reviewsMenu.movies", icon: "Movie", url: "/categories/movies" },
  { id: "electronics", title: "mainMenu.reviewsMenu.electronics", icon: "Movie", url: "/categories/electronics" },
  { id: "books", title: "mainMenu.reviewsMenu.books", icon: "MenuBook", url: "/categories/books" },
  { id: "games", title: "mainMenu.reviewsMenu.games", icon: "SportsEsports", url: "/categories/games" },
  // { id: "products", title: "mainMenu.reviewsMenu.products", icon: "ShoppingCart", url: "/categories/products" },
  // { id: "places", title: "mainMenu.reviewsMenu.places", icon: "Place", url: "/categories/places" },
  { id: "restaurants", title: "mainMenu.reviewsMenu.restaurants", icon: "Restaurant", url: "/categories/restaurants" },
  // { id: "recipes", title: "mainMenu.reviewsMenu.recipes", icon: "RestaurantMenu", url: "/categories/recipes" },
  // { id: "videos", title: "mainMenu.reviewsMenu.videos", icon: "VideoLibrary", url: "/categories/videos" },
  // { id: "apps", title: "mainMenu.reviewsMenu.apps", icon: "Apps", url: "/categories/apps" },
  // { id: "services", title: "mainMenu.reviewsMenu.services", icon: "Build", url: "/categories/services" },
  // { id: "events", title: "mainMenu.reviewsMenu.events", icon: "Event", url: "/categories/events" },
  { id: "other", title: "mainMenu.reviewsMenu.other", icon: "MoreHoriz", url: "/categories/other" },
];

export interface MainMenuItemProps {
  id: string;
  title: string;
  icon?: string;
  subMenus?: ReviewsMenuItemProps[];
  url?: string;
}

export const sarMenus: MainMenuItemProps[] = [
  { id: "reviews", title: "mainMenu.reviews", subMenus: reviewMenus, icon: "reviews", url: "/categories" },
  { id: "myReviews", title: "mainMenu.myReviews", icon: "myReviews", url: "/my-reviews" },
  { id: "writeReview", title: "mainMenu.writeReview", icon: "create", url: "/reviews/write-review" },
];
