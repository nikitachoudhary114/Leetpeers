import cron from "node-cron";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { fetchLeetCodeStats, getTodaySolvedCount } from "@/lib/leetcode";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

cron.schedule("0 21 * * *", async () => {
  console.log("Running daily check job...");

  const users = await prisma.user.findMany({
    include: { rooms: true },
  });

  for (const user of users) {
    if (!user.leetcodeProfile) continue;
    for (const room of user.rooms) {
      const stats = await fetchLeetCodeStats(user.leetcodeProfile);
      const solvedToday = getTodaySolvedCount(stats);

      if (solvedToday < room.dailyTarget) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Daily Target Not Completed 🚨",
          text: `Hi ${user.name}, you have not completed your daily target of ${room.dailyTarget} problems in room ${room.name}.`,
        });
      }
    }
  }
});