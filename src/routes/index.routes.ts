import express from "express"
import { Request, Response, NextFunction } from 'express';
import courseRoutes from "./course.routes"
import studentRoutes from "./student.routes"
import enrollmentRoutes from "./enrollment.routes"
import prisma from "../db"

const router = express.Router()

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.get("/specs", async (req: Request, res: Response, next: NextFunction) => {
  const now = new Date()
  console.log("starting db fetch")
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
    console.log("completed db fetch")
    console.log(courses)
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

router.use('/courses', courseRoutes)
router.use('/students', studentRoutes)
router.use("/enrollments", enrollmentRoutes)

export default router