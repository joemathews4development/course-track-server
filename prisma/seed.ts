import { PrismaClient, GraduationStatus } from "@prisma/client"

const prisma = new PrismaClient()

// 🎯 Realistic names
const names = [
  "Liam Müller", "Emma Schmidt", "Noah Schneider", "Mia Fischer", "Leon Weber",
  "Sophia Wagner", "Paul Becker", "Hannah Hoffmann", "Finn Schäfer", "Lina Koch",
  "Jonas Bauer", "Lea Richter", "Elias Klein", "Marie Wolf", "Ben Neumann",
  "Anna Schwarz", "Luis Zimmermann", "Clara Braun", "Tim Krüger", "Nina Hartmann",
  "David Lange", "Laura Schmitt", "Felix Werner", "Sarah Krause", "Max Vogel"
]

function generateAvatar(name: string) {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

async function main() {
  // 1. Courses
  await prisma.course.createMany({
    data: [
      { title: "Mathematics", description: "Algebra & Calculus", start: new Date() },
      { title: "Physics", description: "Mechanics & Energy", start: new Date() },
      { title: "Chemistry", description: "Organic Chemistry", start: new Date() },
      { title: "Biology", description: "Human Biology", start: new Date() },
      { title: "History", description: "European History", start: new Date() },
      { title: "Computer Science", description: "Programming Basics", start: new Date() },
      { title: "Literature", description: "World Classics", start: new Date() },
      { title: "Philosophy", description: "Ethics & Logic", start: new Date() },
      { title: "Economics", description: "Markets & Finance", start: new Date() },
      { title: "Art & Design", description: "Creative Thinking", start: new Date() }
    ]
  })

  const courses = await prisma.course.findMany()

  // 2. Students with avatars
  const studentsData = names.map((name, index) => ({
    name,
    email: `user${index + 1}@example.com`,
    profileImage: generateAvatar(name)
  }))

  await prisma.student.createMany({ data: studentsData })

  const students = await prisma.student.findMany()

  // 3. Enrollments
  const enrollments: any[] = []

  for (const student of students) {
    const shuffledCourses = [...courses].sort(() => 0.5 - Math.random())
    const selectedCourses = shuffledCourses.slice(0, Math.floor(Math.random() * 3) + 2)

    for (const course of selectedCourses) {
      enrollments.push({
        studentId: student.id,
        courseId: course.id,
        graduationStatus: randomStatus()
      })
    }
  }

  await prisma.enrollment.createMany({
    data: enrollments,
    skipDuplicates: true
  })

  console.log("✅ Realistic seed data created")
}

function randomStatus(): GraduationStatus {
  const statuses = [
    GraduationStatus.ONGOING,
    GraduationStatus.PASSED,
    GraduationStatus.FAILED
  ]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())