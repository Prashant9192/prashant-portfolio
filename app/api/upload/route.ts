import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

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
    } else if (type === 'resume') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Resume must be a PDF file' },
          { status: 400 }
        )
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${type}s`,
          resource_type: type === 'resume' ? 'raw' : 'image',
          public_id: `${type}_${Date.now()}`,
          // Optional transformations for specific types
          ...(type === 'avatar' && {
            transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
          }),
          ...(type === 'favicon' && {
            transformation: [{ width: 32, height: 32, crop: 'fit' }]
          })
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            resolve(NextResponse.json(
              { error: 'Failed to upload to Cloudinary' },
              { status: 500 }
            ))
            return
          }

          resolve(NextResponse.json({
            success: true,
            path: result?.secure_url,
            filename: result?.public_id
          }))
        }
      )

      uploadStream.end(buffer)
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}


