import express from "express"
import { Request, Response, NextFunction } from "express"
import prisma from "../db"

const router = express.Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, profileImage } = req.body
        const newStudent = {
            name, email, profileImage
        }
        const newStudentInDB = await prisma.student.create({ data: newStudent })
        res.status(201).json(newStudentInDB)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.put("/:studentId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params.studentId as string
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: req.body
        })
        res.status(200).json(updatedStudent)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const students = await prisma.student.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                courses: {
                    select: {
                        graduationStatus: true
                    }
                }
            }
        })
        res.status(200).json(students)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/:studentId", async(req: Request, res: Response, next: NextFunction) => {
    const studentId = req.params.studentId as string
    try {
        const student = await prisma.student.findFirst({
            where: { id: studentId },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                courses: {
                    select: {
                        graduationStatus: true
                    }
                }
            }
        })
        res.status(200).json(student)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/courses/:courseId", async(req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId as string
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { courseId: courseId },
            select: { studentId: true }
        })
        const enrolledStudentIds = enrollments.map(e => e.studentId)
        const students = await prisma.student.findMany({
            where: { id: { notIn: enrolledStudentIds } }
        })
        res.status(200).json(students)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.delete("/:studentId", async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.params.studentId as string
    try {
        const enrollmentsCount = await prisma.enrollment.count({
            where: { id: studentId }
        })
        if (enrollmentsCount > 0) {
            return res.status(412).json({ errorMessage: "Cannot delete student with enrollments" })
        }
        await prisma.course.delete({
            where: { id: studentId }
        })
        res.status(200).json({ message: "Course deleted successfully" })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default router