"use client"
import React ,{useState,useEffect,useRef} from 'react'
import { CldImage } from 'next-cloudinary';


const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  };

  type SocialFormat = keyof typeof socialFormats;




export default function SocialShare() {

  const [uploadedImage , setUploadedImage] = useState<string | null>(null);
  const [selectedFormat,setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isTransforming,setIsTransforming] = useState(false);
  const [isUploading,setIsUploading] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {   // jaha bhi selectformat aur uploadimg me change hoaga wha pe isTranform ko update krunaga
    if(uploadedImage){
      setIsTransforming(true);
    }
    
  }, [selectedFormat,uploadedImage])


const handleFileUpload = async (event:React.
  ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    const formData = new FormData();  //agr file hai to formdata lelo
    formData.append("file",file);    // aur append krdo

    try {
      const response = await fetch ("/api/image-upload ",{
        method: "POST",
        body:formData
      })

      if(!response.ok) throw new Error ("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
      
    } catch (error) {
        console.log(error)
        alert("Failed to upload image")
    } finally{
      setIsUploading(false)
    }
};

const handleDownload = () =>{
    if(!imageRef.current) return;  // check krta h ki img loaded h ki nhi

    fetch(imageRef.current.src) // img ka actual url nikal rhe..browser se img data la rhe
    .then((response) => response.blob())  // it will download the thing (img to downloadable binary data)
    .then((blob) => {  // binary large object
            const url = window.URL.createObjectURL(blob)  //temperory url
            
            const link = document.createElement("a");   // a tag to down file without new tab 

            link.href = url;  // set kr diya url

            link.download = `${selectedFormat // IMAG KE NAME KE HISAB SE FILENAME DOWNLOD selectedformat usestate
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
            document.body.appendChild(link);  //BROWSER ME A TAG ADDED
            link.click();                  // CLICK SE SIMULATE
            document.body.removeChild(link);  // DOWNLOAD KE BAAD A TAG REMOVE
            window.URL.revokeObjectURL(url);  // URL BHI DELETE
            document.body.removeChild(link);
        })
}

  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Social Media Image Creator
          </h1>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Upload an Image</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Choose an image file</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              {isUploading && (
                <div className="mt-4">
                  <progress className="progress progress-primary w-full"></progress>
                </div>
              )}

              {uploadedImage && (
                <div className="mt-6">
                  <h2 className="card-title mb-4">Select Social Media Format</h2>
                  <div className="form-control">
                    <select
                      className="select select-bordered w-full"
                      value={selectedFormat}
                      onChange={(e) =>
                        setSelectedFormat(e.target.value as SocialFormat)
                      }
                    >
                      {Object.keys(socialFormats).map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 relative">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <div className="flex justify-center">
                      {isTransforming && (
                        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                          <span className="loading loading-spinner loading-lg"></span>
                        </div>
                      )}
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity='auto'
                        ref={imageRef}
                        onLoad={() => setIsTransforming(false)}
                        />
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={handleDownload}>
                      Download for {selectedFormat}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


  )
}

