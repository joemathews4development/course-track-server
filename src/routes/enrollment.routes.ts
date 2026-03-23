import express from "express"
import { Request, Response, NextFunction } from "express"
import prisma from "../db"

const router = express.Router()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, courseId, enrolledAt } = req.body
    const newEnrollment = {
        studentId,
        courseId,
        enrolledAt
    }
    try {
        const newEnrollmentInDB = await prisma.enrollment.create({ data: newEnrollment })
        res.status(201).json(newEnrollmentInDB)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.patch(`/:enrollmentId`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollmentId = req.params.enrollmentId as string
        const graduationStatus = req.body.graduationStatus
        const graduationDate = req.body.graduationDate
        const updatedEnrollment = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                graduationDate: graduationDate,
                graduationStatus: graduationStatus
            }
        })
        res.status(200).json(updatedEnrollment)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.delete("/:courseId/:studentId", async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId as string
    const studentId = req.params.studentId as string
    try {
        await prisma.enrollment.delete({
            where: {
                studentId_courseId: {
                    studentId: studentId,
                    courseId: courseId
                }
            }
        })
        res.status(200).json({ message: "Course deleted successfully" })
    } catch (error) {
        console.log(error)
        next(error)
    }
})
