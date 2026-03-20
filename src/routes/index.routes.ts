import express from "express"
import { Request, Response, NextFunction } from 'express';
import courseRoutes from "./course.routes"
import prisma from "../db"

const router = express.Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.get("/specs", async (req: Request, res: Response, next: NextFunction) => {
  const now = new Date()
  try {
    const [courses, students, enrollments, upcomingCourses] = await Promise.all([
      prisma.course.count(),
      prisma.student.count(),
      prisma.enrollment.count(),
      prisma.course.findMany({
        where: {
          start: {
            gte: now // only future (or current) courses
          }
        },
        orderBy: {
          start: "asc" // soonest first
        },
        take: 3 // only 3 courses
      })
    ])
    let result = {
      courses: courses,
      students: students,
      enrollments: enrollments,
      upcomingCourses: upcomingCourses
    }
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.use('/courses', courseRoutes);

export default router