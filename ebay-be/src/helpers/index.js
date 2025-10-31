import Notification from "../models/Notification.js";
import User from "../models/User.js";
import UserNotification from "../models/UserNotification.js";

export const createNotification = async ({
  targetType = "all",
  userId,
  title,
  message,
  link,
  data,
}) => {
  try {
    const notification = await Notification.create({
      targetType,
      title,
      message,
      message,
      link,
      data,
    });

    if (targetType === "all") {
      const users = await User.find({}, "_id");
      const userNotifications = users.map((user) => ({
        userId: user._id,
        notification: notification._id,
      }));

      await UserNotification.insertMany(userNotifications);
    } else if (targetType === "single") {
      await UserNotification.create({
        userId,
        noticationId: notification._id,
      });
    }
    return notification;
  } catch (error) {
    console.error("Error creating notification: ", error);
    throw new Error("Cannot create notification");
  }
};
