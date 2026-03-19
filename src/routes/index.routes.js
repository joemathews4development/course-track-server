const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const courseRoutes = require('./course.routes');
router.use('/courses', courseRoutes);

module.exports = router;