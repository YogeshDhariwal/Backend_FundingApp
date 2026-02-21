
import { ACCESS_RANK } from "../utils/access.js";
import { ApiError } from "../utils/ApiError.js";

export const canAccess = (requiredLevel) => {
  return (req, res, next) => {
    const userPlan = req.user?.membership?.planType || "Public";

    if (ACCESS_RANK[userPlan] < ACCESS_RANK[requiredLevel]) {
      throw new ApiError(403, "Upgrade your plan");
    }

    next();
  };
};