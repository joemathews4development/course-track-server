const router = require("express").Router()
const prisma = require("../db")

router.post('/', async (req, res) => {
    const { title, description } = req.body
    const newCourse = {
        title,
        description
    }
    try {
        const newCourseInDB = await prisma.course.create({ data: newCourse })
        res.status(201).json(newCourseInDB)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
    
})

module.exports = router