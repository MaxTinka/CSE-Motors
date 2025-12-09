const reviewModel = {
  // Add a new review
  addReview: async (inv_id, account_id, review_text, rating) => {
    const sql = `INSERT INTO reviews (inv_id, account_id, review_text, rating) 
                 VALUES ($1, $2, $3, $4) RETURNING *`;
    return await pool.query(sql, [inv_id, account_id, review_text, rating]);
  },
  
  // Get reviews for a vehicle
  getReviewsByInventoryId: async (inv_id) => {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM reviews r 
                 JOIN account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 AND r.is_approved = true 
                 ORDER BY r.review_date DESC`;
    return await pool.query(sql, [inv_id]);
  },
  
  // Get average rating for a vehicle
  getAverageRating: async (inv_id) => {
    const sql = `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count 
                 FROM reviews 
                 WHERE inv_id = $1 AND is_approved = true`;
    return await pool.query(sql, [inv_id]);
  },
  
  // Admin: Get pending reviews for approval
  getPendingReviews: async () => {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, a.account_firstname 
                 FROM reviews r 
                 JOIN inventory i ON r.inv_id = i.inv_id 
                 JOIN account a ON r.account_id = a.account_id 
                 WHERE r.is_approved = false 
                 ORDER BY r.review_date`;
    return await pool.query(sql);
  },
  
  // Admin: Approve a review
  approveReview: async (review_id) => {
    const sql = `UPDATE reviews SET is_approved = true WHERE review_id = $1 RETURNING *`;
    return await pool.query(sql, [review_id]);
  },
  
  // Admin: Delete a review
  deleteReview: async (review_id) => {
    const sql = `DELETE FROM reviews WHERE review_id = $1 RETURNING *`;
    return await pool.query(sql, [review_id]);
  }
};
