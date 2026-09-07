const validPriorities = [
    "high",
    "medium",
    "low",
  ];
  
  const validCategories = [
    "University",
    "Work",
    "Personal",
    "Shopping",
    "Other",
  ];
  
  function validateTask(req, res, next) {
    const {
      text,
      priority,
      category,
    } = req.body;
  
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Task text is required",
      });
    }
  
    if (
      priority &&
      !validPriorities.includes(priority)
    ) {
      return res.status(400).json({
        error: "Invalid priority",
      });
    }
  
    if (
      category &&
      !validCategories.includes(category)
    ) {
      return res.status(400).json({
        error: "Invalid category",
      });
    }
  
    next();
  }
  
  module.exports = validateTask;
  