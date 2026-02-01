const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth');
const { mongoIdValidator } = require('../middleware/validators');

// All routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.delete('/', clearWishlist);
router.post('/:propertyId', addToWishlist);
router.delete('/:propertyId', removeFromWishlist);
router.get('/check/:propertyId', checkWishlist);

module.exports = router;
