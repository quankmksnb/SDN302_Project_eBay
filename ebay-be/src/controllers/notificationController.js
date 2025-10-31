import UserNotification from "../models/UserNotification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await UserNotification.find({ userId })
      .populate("notificationId")
      .sort({ date: -1 });
    res.status(200).json({
      succes: false,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ succes: false, message: "Server error" });
  }
};
