interface ReviewsMenuItemProps {
  id: string;
  title: string;
  icon?: string;
}

const reviewMenus: ReviewsMenuItemProps[] = [
  { id: "allReviews", title: "mainMenu.reviewsMenu.allReviews", icon: "RateReview" },
  { id: "movies", title: "mainMenu.reviewsMenu.movies", icon: "Movie" },
  { id: "books", title: "mainMenu.reviewsMenu.books", icon: "MenuBook" },
  { id: "music", title: "mainMenu.reviewsMenu.music", icon: "MusicNote" },
  { id: "games", title: "mainMenu.reviewsMenu.games", icon: "SportsEsports" },
  { id: "products", title: "mainMenu.reviewsMenu.products", icon: "ShoppingCart" },
  { id: "places", title: "mainMenu.reviewsMenu.places", icon: "Place" },
  { id: "restaurants", title: "mainMenu.reviewsMenu.restaurants", icon: "Restaurant" },
  { id: "recipes", title: "mainMenu.reviewsMenu.recipes", icon: "RestaurantMenu" },
  { id: "videos", title: "mainMenu.reviewsMenu.videos", icon: "VideoLibrary" },
  { id: "apps", title: "mainMenu.reviewsMenu.apps", icon: "Apps" },
  { id: "services", title: "mainMenu.reviewsMenu.services", icon: "Build" },
  { id: "events", title: "mainMenu.reviewsMenu.events", icon: "Event" },
  { id: "other", title: "mainMenu.reviewsMenu.other", icon: "MoreHoriz" },
];

interface MainMenuItemProps {
  id: string;
  title: string;
  icon?: string;
  subMenus?: ReviewsMenuItemProps[];
}

export const sarMenus: MainMenuItemProps[] = [
  { id: "reviews", title: "mainMenu.reviews", subMenus: reviewMenus, icon: "reviews" },
  { id: "myReviews", title: "mainMenu.myReviews", icon: "myReviews" },
  { id: "writeReview", title: "mainMenu.writeReview", icon: "create" },
];
