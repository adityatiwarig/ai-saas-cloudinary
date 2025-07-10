import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // client side 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

interface CloudinaryUploadResult {  //kisi object m kon se fields hone chiye or type kya h

    public_id: string;             // jo bhi result aaye usme public_id must hona chiye
    [key: string]: any             // baki kuch bhi aaye 
}

export async function POST(request: NextRequest) {
    const {userId} = await auth()                     // loggin h ki nhi

    if (!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const formData = await request.formData();    // file ko client se recieve krne k liye
        const file = formData.get("file") as File | null;

        if(!file){
            return NextResponse.json({error: "File not found"}, {status: 400})
        }

        const bytes = await file.arrayBuffer()  // file ko arr if bytes me conv
        const buffer = Buffer.from(bytes)      // arr buff ko node.js buff con

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(  // RESPONS TO UPLOAD ANY DATA ON CLOUD
                    {folder: "next-cloudinary-uploads"},  //KAHA PE UPLOAD HOGA
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )
        return NextResponse.json(
            {
                publicId: result.public_id   // only upload on cloud and send id
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Upload image failed", error)
        return NextResponse.json({error: "Upload image failed"}, {status: 500})
    }

}