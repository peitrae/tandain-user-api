import { validateBody } from '@/middleware/validate';
import { Router } from 'express';

import Auth from '../service';

const router = Router();

router.post(
	'/auth/login',
	validateBody(['code', 'redirectUri']),
	async (req, res) => {
		try {
			const { code, redirectUri } = req.body;

			const { idToken, message, refreshToken } = await Auth.loginWithGoogle(
				code,
				redirectUri,
				req.ip
			);

			res
				.cookie('id_token', idToken, {
					httpOnly: true,
					secure: true,
				})
				.send({ message, refresh_token: refreshToken });
		} catch (err) {
			res.status(err.code).json({ ...err, message: err.message });
		}
	}
);

export default router;
