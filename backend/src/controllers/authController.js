const authService = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
