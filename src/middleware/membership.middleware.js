import mongoose from 'mongoose'
import { Membership } from '../model/membership.model.js';

membershipSchema.pre("save", function (next) {
  if (this.planType === "Basic") {
    this.price = 30;
  } else if (this.planType === "Pro") {
    this.price = 50;
  } else if (this.planType === "Premium") {
    this.price = 100;
  }

  next();
});

