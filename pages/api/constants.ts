export const selectReviews = (category: string = "") => `SELECT
  r.id AS review_id,
  r.user_id AS review_user_id,
  u.name AS review_user_name,
  u.email AS review_user_email,
  i.name AS item_name,
  i.category_id AS item_category_id,
  cat.name AS item_category_name,
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
  ${category ? `WHERE LOWER(cat.name) = $1` : ""}
GROUP BY
  r.id, u.name, u.email, i.name, i.category_id, cat.name, i.description, i.date_created;
`;
