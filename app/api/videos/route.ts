import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"  

const prisma = new PrismaClient();

export async function GET(request: NextRequest){
    try {
        const videos = await prisma.video.findMany({   
            orderBy: {createdAt: "desc"}             // NAYA PHELE PURANA BAAAD ME
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error("❌ Prisma Error:", error);
        return NextResponse.json({error: "Error fetching videos"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}
