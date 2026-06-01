const { authService } = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const result = await authService.register(email, username, password);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      const status = error.message.includes('already') ? 409 : 400;
      res.status(status).json({ success: false, error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.user.userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
}

const authController = new AuthController();
module.exports = { authController };
