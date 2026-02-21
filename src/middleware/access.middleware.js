
import { ACCESS_RANK } from "../utils/access.js";
import { ApiError } from "../utils/ApiError.js";
import { Membership } from "../model/membership.model.js";

export const canAccess = (requiredLevel) => {
  return async(req, res, next) => {
    const membership = await Membership.aggregate([
      {$match : {owner:req.user._id}},{$project:{planType:1}}
    ])
    const userPlan = membership[0]?.planType || "Public";

    if (ACCESS_RANK[userPlan] < ACCESS_RANK[requiredLevel]) {
      throw new ApiError(403, "Upgrade your plan");
    }

    next();
  };
};