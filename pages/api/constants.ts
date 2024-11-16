export const selectLatestReviewedItems = () => {
  return `WITH LatestReview AS (
  SELECT
    r.item_id,
    r.date_created,
    ROW_NUMBER() OVER (PARTITION BY r.item_id ORDER BY r.date_created DESC) AS rank
  FROM
    reviews r
  WHERE
    r.date_created >= NOW() - INTERVAL '7 days'
)
SELECT
  i.id AS item_id,
  i.name AS item_name,
  i.slug AS item_slug,
  i.description AS item_description,
  i.category_id AS item_category_id,
  cat.name AS item_category_name,
  cat.slug AS item_category_slug,
  i.description AS item_description,
  i.date_created AS item_date_created
FROM
  items i
INNER JOIN
  LatestReview lr ON i.id = lr.item_id AND lr.rank = 1
LEFT JOIN
  categories cat ON i.category_id = cat.id
ORDER BY
  lr.date_created DESC;`;
};

export const selectMostRatedItemsByCategory = () => {
  return `WITH ItemRating AS (
  SELECT
    r.item_id,
    AVG(r.rating)::int AS average_rating,
    COUNT(r.id) AS number_of_reviews
  FROM
    reviews r
  GROUP BY
    r.item_id
),
MostAppreciated AS (
  SELECT
    ir.item_id,
    ir.average_rating,
    ir.number_of_reviews
  FROM
    ItemRating ir
)
SELECT
  i.id AS item_id,
  i.name AS item_name,
  i.slug AS item_slug,
  i.description AS item_description,
  i.category_id AS item_category_id,
  cat.name AS item_category_name,
  cat.slug AS item_category_slug,
  i.description AS item_description,
  i.date_created AS item_date_created,
  ir.average_rating AS item_average_rating,
  ir.number_of_reviews AS item_number_of_reviews
FROM
  items i
INNER JOIN
  MostAppreciated ma ON i.id = ma.item_id
INNER JOIN
  ItemRating ir ON i.id = ir.item_id
LEFT JOIN
  categories cat ON i.category_id = cat.id
ORDER BY
  cat.slug ASC, ma.average_rating DESC, ma.number_of_reviews DESC;`;
};

export const selectMostRecentItems = () => {
  return `SELECT
  i.id AS item_id,
  i.name AS item_name,
  i.slug AS item_slug,
  i.description AS item_description,
  i.category_id AS item_category_id,
  cat.name AS item_category_name,
  cat.slug AS item_category_slug,
  i.description AS item_description,
  i.date_created AS item_date_created
FROM
  items i
LEFT JOIN
  categories cat ON i.category_id = cat.id
WHERE i.date_created >= NOW() - INTERVAL '7 days'
ORDER BY
  i.date_created DESC;`;
};

export const selectItem = () => {
  return `SELECT
  r.id AS review_id,
  r.user_id AS review_user_id,
  u.name AS review_user_name,
  u.email AS review_user_email,
  i.name AS item_name,
  i.category_id AS item_category_id,
  cat.name AS item_category_name,
  cat.slug AS item_category_slug,
  i.description AS item_description,
  i.date_created AS item_date_created,
  r.rating AS review_rating,
  r.content AS review_content,
  r.likes AS review_likes,
  r.dislikes AS review_dislikes,
  r.date_created AS review_date_created,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'user_id', c.user_id,
        'user_name', cu.name,
        'content', c.content,
        'likes', c.likes,
        'dislikes', c.dislikes,
        'date_created', c.date_created
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) AS comments
FROM
  reviews r
JOIN
  users u ON r.user_id = u.id
JOIN
  items i ON r.item_id = i.id
LEFT JOIN
  categories cat ON i.category_id = cat.id
LEFT JOIN
  comments c ON r.id = c.review_id
LEFT JOIN
  users cu ON c.user_id = cu.id
WHERE i.slug = $1
GROUP BY
  r.id, u.name, u.email, i.name, i.category_id, cat.name, cat.slug, i.description, i.date_created;
`;
};

export const selectReviewsByCategory = (category: string = "", query: string = "") => {
  let i = 1;
  return `SELECT
  r.id AS review_id,
  r.user_id AS review_user_id,
  u.name AS review_user_name,
  u.email AS review_user_email,
  i.name AS item_name,
  i.category_id AS item_category_id,
  cat.name AS item_category_name,
  cat.slug AS item_category_slug,
  i.description AS item_description,
  i.date_created AS item_date_created,
  r.rating AS review_rating,
  r.content AS review_content,
  r.likes AS review_likes,
  r.dislikes AS review_dislikes,
  r.date_created AS review_date_created,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'user_id', c.user_id,
        'user_name', cu.name,
        'content', c.content,
        'likes', c.likes,
        'dislikes', c.dislikes,
        'date_created', c.date_created
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) AS comments
FROM
  reviews r
JOIN
  users u ON r.user_id = u.id
JOIN
  items i ON r.item_id = i.id
LEFT JOIN
  categories cat ON i.category_id = cat.id
LEFT JOIN
  comments c ON r.id = c.review_id
LEFT JOIN
  users cu ON c.user_id = cu.id
WHERE TRUE
  ${category ? `AND LOWER(cat.name) = $${i++}` : ""}
  ${query ? `AND LOWER(i.name) LIKE $${i++}` : ""}
GROUP BY
  r.id, u.name, u.email, i.name, i.category_id, cat.name, cat.slug, i.description, i.date_created;
`;
};

export const getNotificationsQuery = (userId: number) => {
  return `SELECT
  n.id,
  n.title,
  n.message,
  n.status,
  n.type,
  n.folder,
  n.sent_at
FROM
  notifications n
WHERE
  n.user_id = ${userId}
ORDER BY
  n.sent_at DESC;`;
};

export const getNotificationsCountQuery = (userId: number) => {
  return `SELECT COUNT(*) as count FROM notifications WHERE user_id = ${userId} AND status = 'unread' and folder != 'trash';`;
};
