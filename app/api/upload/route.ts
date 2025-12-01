import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'avatar', 'resume', or 'project'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || (type !== 'avatar' && type !== 'resume' && type !== 'project')) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "avatar", "resume", or "project"' },
        { status: 400 }
      )
    }

    // Validate file type
    if (type === 'avatar' || type === 'project') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `${type === 'avatar' ? 'Avatar' : 'Project image'} must be an image file` },
          { status: 400 }
        )
      }
    } else if (type === 'resume') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Resume must be a PDF file' },
          { status: 400 }
        )
      }
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    
    // Generate filename
    const timestamp = Date.now()
    let filename: string
    let filePath: string

    if (type === 'avatar') {
      filename = `avatar-${timestamp}.${fileExtension}`
      filePath = join(process.cwd(), 'public', filename)
    } else if (type === 'resume') {
      filename = `resume-${timestamp}.${fileExtension}`
      filePath = join(process.cwd(), 'public', filename)
    } else {
      // Project images - optionally store in projects subfolder
      filename = `project-${timestamp}.${fileExtension}`
      filePath = join(process.cwd(), 'public', filename)
    }

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public path
    const publicPath = `/${filename}`
    
    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

