import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

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
    const type = formData.get('type') as string // 'avatar', 'resume', 'project', or 'favicon'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || (type !== 'avatar' && type !== 'resume' && type !== 'project' && type !== 'favicon')) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "avatar", "resume", "project", or "favicon"' },
        { status: 400 }
      )
    }

    // Validate file type
    if (type === 'avatar' || type === 'project' || type === 'favicon') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `${type === 'avatar' ? 'Avatar' : type === 'project' ? 'Project image' : 'Favicon'} must be an image file` },
          { status: 400 }
        )
      }
      
      // For favicon, prefer .ico, .png, or .svg
      if (type === 'favicon') {
        const allowedExtensions = ['ico', 'png', 'svg', 'jpg', 'jpeg', 'webp']
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
        if (!allowedExtensions.includes(fileExtension)) {
          return NextResponse.json(
            { error: 'Favicon must be .ico, .png, .svg, .jpg, .jpeg, or .webp format' },
            { status: 400 }
          )
        }

        // Validate favicon file size (max 100KB)
        if (file.size > 100 * 1024) {
          return NextResponse.json(
            { error: 'Favicon file size must be less than 100KB. Please use a smaller image or our favicon generator.' },
            { status: 400 }
          )
        }
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
    } else if (type === 'favicon') {
      // Save favicon to public folder
      filename = `favicon.${fileExtension}`
      filePath = join(process.cwd(), 'public', filename)
    } else {
      // Project images
      filename = `project-${timestamp}.${fileExtension}`
      filePath = join(process.cwd(), 'public', filename)
    }

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)

    // Optimize favicon using sharp
    if (type === 'favicon') {
      try {
        buffer = await sharp(buffer)
          .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png({ quality: 90, compressionLevel: 9 })
          .toBuffer()
      } catch (error) {
        console.error('Error optimizing favicon:', error)
        // Continue with original buffer if optimization fails
      }
    }

    // Save file
    await writeFile(filePath, buffer)

    // For favicon, also save to app directory as favicon.ico for Next.js automatic detection
    if (type === 'favicon') {
      const appDir = join(process.cwd(), 'app')
      
      // Ensure app directory exists
      if (!existsSync(appDir)) {
        await mkdir(appDir, { recursive: true })
      }
      
      // Next.js prioritizes app/favicon.ico - always save as favicon.ico regardless of original format
      const appIconPath = join(appDir, 'favicon.ico')
      await writeFile(appIconPath, buffer)
    }

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

