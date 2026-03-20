import express from "express"
import { Request, Response, NextFunction } from "express"
import prisma from "../db"

const router = express.Router()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, start } = req.body
    const newCourse = {
        title,
        description,
        start
    }
    try {
        const newCourseInDB = await prisma.course.create({ data: newCourse })
        res.status(201).json(newCourseInDB)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.put(`/:courseId`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.courseId as string
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: req.body
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                start: true,
                students: {
                    select: {
                        graduationStatus: true
                    }
                }
            }
        })
        const result = courses.map(course => {
            let passed = 0
            let failed = 0
            for (const s of course.students) {
                if (s.graduationStatus === "PASSED") passed++
                else if (s.graduationStatus === "FAILED") failed++
            }
            return {
                id: course.id,
                title: course.title,
                start: course.start,
                totalStudents: course.students.length,
                passedStudents: passed,
                failedStudents: failed
            }
        })
        res.status(200).json(courses)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/:courseId", async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId as string
    try {
        const courses = await prisma.course.findFirst({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                start: true,
                students: {
                    select: {
                        graduationStatus: true,
                        graduationDate: true,
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(courses)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.delete("/:courseId", async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId as string
    try {
        const enrollmentsCount = await prisma.enrollment.count({
            where: { id: courseId }
        })
        if (enrollmentsCount > 0) {
            return res.status(412).json({ errorMessage: "Cannot delete course with enrollments" })
        }
        await prisma.course.delete({
            where: { id: courseId }
        })
        res.status(200).json({ message: "Course deleted successfully" })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default router