const reviewsController = {
  // Add a review
  addReview: async (req, res) => {
    try {
      const { inv_id, review_text, rating } = req.body;
      const account_id = res.locals.accountData.account_id;
      
      // Validation
      if (!review_text || review_text.trim().length < 10) {
        req.flash('error', 'Review must be at least 10 characters.');
        return res.redirect(`/inv/detail/${inv_id}`);
      }
      
      if (!rating || rating < 1 || rating > 5) {
        req.flash('error', 'Please select a rating between 1 and 5 stars.');
        return res.redirect(`/inv/detail/${inv_id}`);
      }
      
      const result = await reviewModel.addReview(inv_id, account_id, review_text, rating);
      
      if (result) {
        req.flash('success', 'Review submitted! It will appear after approval.');
        res.redirect(`/inv/detail/${inv_id}`);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      req.flash('error', 'Failed to submit review.');
      res.redirect(`/inv/detail/${inv_id}`);
    }
  },
  
  // Display review management (Admin only)
  manageReviews: async (req, res) => {
    try {
      if (res.locals.accountData.account_type !== 'Admin') {
        req.flash('error', 'Admin access required.');
        return res.redirect('/account/');
      }
      
      const pendingReviews = await reviewModel.getPendingReviews();
      let nav = await utilities.getNav();
      
      res.render('./reviews/manage', {
        title: 'Manage Reviews',
        nav,
        pendingReviews: pendingReviews.rows,
        errors: null
      });
    } catch (error) {
      console.error('Error loading review management:', error);
      next(error);
    }
  },
  
  // Approve a review (Admin)
  approveReview: async (req, res) => {
    try {
      const { review_id } = req.body;
      const result = await reviewModel.approveReview(review_id);
      
      if (result) {
        req.flash('success', 'Review approved successfully.');
      } else {
        req.flash('error', 'Failed to approve review.');
      }
      res.redirect('/reviews/manage');
    } catch (error) {
      console.error('Error approving review:', error);
      req.flash('error', 'An error occurred.');
      res.redirect('/reviews/manage');
    }
  },
  
  // Delete a review (Admin)
  deleteReview: async (req, res) => {
    try {
      const { review_id } = req.body;
      const result = await reviewModel.deleteReview(review_id);
      
      if (result) {
        req.flash('success', 'Review deleted successfully.');
      } else {
        req.flash('error', 'Failed to delete review.');
      }
      res.redirect('/reviews/manage');
    } catch (error) {
      console.error('Error deleting review:', error);
      req.flash('error', 'An error occurred.');
      res.redirect('/reviews/manage');
    }
  }
};
