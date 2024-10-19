//Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted');
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};

export default isAdmin;