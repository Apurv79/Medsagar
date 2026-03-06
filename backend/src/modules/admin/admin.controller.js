import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import * as authService from "../auth/auth.service.js";

/**
 * Admin: Create User Credentials
 * Requirement 3: Admin creates account, system generates random password and emails it.
 */
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, role } = req.body;

    if (!["DOCTOR", "CLINIC", "ADMIN"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role for admin creation"
        });
    }

    const user = await authService.createUserCredentialsService({ name, email, role });

    return ApiResponse.success(res, `${role} created successfully and credentials emailed`, user);
});

/**
 * Admin: Forced Password Reset
 */
export const resetUserPassword = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    await authService.adminResetPasswordService(userId);

    return ApiResponse.success(res, "Password reset successfully and new credentials emailed");
});
